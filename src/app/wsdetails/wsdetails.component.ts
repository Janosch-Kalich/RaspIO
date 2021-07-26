import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestsService } from '../requests.service';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-wsdetails',
  templateUrl: './wsdetails.component.html',
  styleUrls: ['./wsdetails.component.scss'],
})
export class WSDetailsComponent implements OnInit {
  wsdetails: any = { readyState: 0 };
  wssub: Subscription;
  id: string;
  prevrs: number;

  constructor(private route: ActivatedRoute, private requests: RequestsService, private router: Router, private wss: WebsocketService, private http: HttpClient, private toastcontroller: ToastController) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params["id"];
      this.requests.storageinit().then(url => {
        this.requests.url = url;
        this.requests.getWS(params["id"]).then(ws => {
          console.log(ws);
          this.wsdetails = ws;
          this.connectws(url, this.id);
        });
      });
    });
  }

  save(attr, val){
    this.wss.close();
    //this.wsobs.unsubscribe();
    let data = { id: this.id, props: {} };
    data.props[attr] = val;
    this.http.post("http://" + this.requests.url + "/setws", data).subscribe(res => {
      this.wsdetails = res;
      this.wssub = this.wss.connect(this.requests.url, { "id": this.id, "action": "get", "type": "ws" }).subscribe(val => {
        console.log(val);
      });
    });
  }

  back(){
    this.wss.close();
    this.router.navigateByUrl("/overview");
  }

  connectws(url, id){
    this.wssub = this.wss.connect(url, { "id": id, "action": "get", "type": "ws" }).subscribe(val => {
      console.log(val.data);
      let data = JSON.parse(val.data);
      if(this.wsdetails["readyState"] != data.wsc["_readyState"]){
        switch(data.wsc["_readyState"] ){
          case 0:
            this.toastcontroller.create({
              header: "Connecting...",
              duration: 2000
            }).then(toast => {
              toast.present();
            });
          break;
          case 1:
            this.toastcontroller.create({
              header: "Connected",
              duration: 2000
            }).then(toast => {
              toast.present();
            });
            break;
          case 3:
            this.toastcontroller.create({
              header: "Disconnected / Failed to connect",
              duration: 2000
            }).then(toast => {
              toast.present();
            });
            break;
        }
      }
      this.wsdetails.value = data["value"];
      this.wsdetails.readyState = data.wsc["_readyState"];
    });
  }

  connectextws(){
    this.wss.close();
    this.connectws(this.requests.url, this.id);
    this.http.post("http://" + this.requests.url + "/connectws", { id: this.id }).subscribe(res => {
      console.log(res);
    });
  }
}