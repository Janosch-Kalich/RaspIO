import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { AlertController, iosTransitionAnimation } from '@ionic/angular';
import { Router } from '@angular/router';
import { RequestsService } from '../requests.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})

export class OverviewComponent implements OnInit {
  title: string = "Overview";
  pins: any;
  websockets: any;
  pinidarray: any[] = [];
  wsidarray: any[] = [];

  constructor(private http: HttpClient, private storage: Storage, private alertcontroller: AlertController, private router: Router, private requests: RequestsService) {}

  ngOnInit() {
    this.requests.storageinit().then(url => {
      this.requests.url = url;
      if(!url){
        this.requests.configalert((data) => {
          console.log(data.url);
          this.storage.set("url", data.url).then(() => {
            this.requests.url = data.url;
            this.requests.getAll().then(obj => {
              this.pins = obj["pins"];
              this.websockets = obj["ws"];
              for(let pin in this.pins["pins"]){
                this.pinidarray.push(pin);
              }
              for(let ws in this.websockets["websockets"]){
                this.wsidarray.push(ws);
              }
            }).catch(err => {
              this.requests.connectionerror();
            });
          });
        });
      }
      else {
        this.requests.getAll().then(obj => {
          this.pins = obj["pins"];
          this.websockets = obj["ws"];
          for(let pin in this.pins["pins"]){
            this.pinidarray.push(pin);
          }
          for(let ws in this.websockets["websockets"]){
            this.wsidarray.push(ws);
          }
        }).catch(err => {
          this.requests.connectionerror();
        })
      }
    });

      //this.pins = res["pins"];
      //this.idarray = res["idarray"];
  }

  details(path, id){
    this.router.navigate([path], { queryParams: { id: id } });
  }

  new(){
    this.alertcontroller.create({
      header: "New Item",
      cssClass: "AlertContainer",
      buttons: [
        {
          text: "Pin",
          cssClass: "AlertButton",
          handler: () => { this.newPin() }
        },
        {
          text: "Websocket",
          cssClass: "AlertButton",
          handler: () => { this.newWS() }
        },
        {
          text: "Cancel",
          cssClass: "AlertCancelButton",
          handler: () => {}
        }
      ]
    }).then(alert => {
      alert.present();
    })

  }

  newPin(){
    this.router.navigate(["newpin"]);
  }

  newWS(){
    this.router.navigate(["newws"]);
  }

  a(){
    console.log("aaa");
  }
}