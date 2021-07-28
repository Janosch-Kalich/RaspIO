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
  valueidarray: any[] = [];

  constructor(private route: ActivatedRoute, private requests: RequestsService, private router: Router, private wss: WebsocketService, private http: HttpClient, private toastcontroller: ToastController) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params["id"];
      this.requests.storageinit().then(url => {
        this.requests.url = url;
        this.requests.getWS(params["id"]).then(ws => {
          this.wsdetails = ws;
          if(!this.wsdetails.data) this.wsdetails.data = {};
          this.valueidarray = [];
          for(let valueid in this.wsdetails.data){
            this.valueidarray.push(valueid);
            if(!this.wsdetails.data[valueid]) this.wsdetails.data[valueid] = {};
          }
          console.log(ws);
          console.log(this.valueidarray);
          this.connectws(url, this.id);
        });
      });
    });
  }

  save(attr, val, extras?){
    this.wss.close();
    //this.wsobs.unsubscribe();
    let data = { id: this.id, props: {} };
    if(extras) data["extras"] = extras;
    data.props[attr] = val;
    this.http.post("http://" + this.requests.url + "/setws", data).subscribe(res => {
      for(let attrs in res){
        if(attrs != "values") this.wsdetails[attrs] = res[attrs];
      }
      console.log(this.wsdetails);
      this.connectws(this.requests.url, this.id);
    });
  }

  back(){
    this.wss.close();
    this.router.navigateByUrl("/overview");
  }

  connectws(url, id){
    this.wssub = this.wss.connect(url, { "id": id, "action": "get", "type": "ws" }).subscribe(val => {
      let data = JSON.parse(val.data);
      console.log(data);
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
      this.wsdetails.values = data["values"];
      this.wsdetails.readyState = data.wsc["_readyState"];
      this.wsdetails["data"] = data["data"];
      for(let elem in this.wsdetails["data"]){
        if(!this.valueidarray.includes(elem)) this.valueidarray.push(elem);
      }
    });
  }

  connectextws(){
    this.wss.close();
    this.connectws(this.requests.url, this.id);
    this.http.post("http://" + this.requests.url + "/connectws", { id: this.id }).subscribe(res => {
      console.log(res);
    });
  }

  deletewsdata(wsid, valueid){
    this.http.post("http://" + this.requests.url + "/deletewsdata", { wsid: wsid, valueid: valueid }).subscribe(res => {
      delete this.wsdetails.data[valueid];
      this.valueidarray.splice(this.valueidarray.indexOf(valueid));
      console.log(res);
    });
  }

  savedata(valueid, attr, val, extras?){
    this.wss.close();
    //this.wsobs.unsubscribe();
    let data = { id: this.id, valueid: valueid, props: {} };
    if(extras) data["extras"] = extras;
    data.props[attr] = val;
    this.http.post("http://" + this.requests.url + "/setwsdata", data).subscribe(res => {
      for(let attrs in res){
        if(attrs != "values") this.wsdetails[attrs] = res[attrs];
      }
      console.log(this.wsdetails);
      this.connectws(this.requests.url, this.id);
    });
  }
}