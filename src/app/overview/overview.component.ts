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
  idarray: any[] = [];

  constructor(private http: HttpClient, private storage: Storage, private alertcontroller: AlertController, private router: Router, private requests: RequestsService) {}

  ngOnInit() {
    this.requests.storageinit().then(url => {
      this.requests.url = url;
      if(!url){
        this.requests.configalert((data) => {
          console.log(data.url);
          this.storage.set("url", data.url).then(() => {
            this.requests.url = data.url;
            this.requests.getPins().then(pins => {
              this.pins = pins;
              for(let pin in pins["pins"]){
                this.idarray.push(pin);
              }
            }).catch(err => {
              this.requests.connectionerror();
            });
          });
        });
      }
      else {
        this.requests.getPins().then(pins => {
          this.pins = pins;
          for(let pin in pins["pins"]){
            this.idarray.push(pin);
          }
        }).catch(err => {
          this.requests.connectionerror();
        })
      }
    });

      //this.pins = res["pins"];
      //this.idarray = res["idarray"];
  }

  details(id){
    this.router.navigate(["details"], { queryParams: { id: id } });
  }

  new(){
    this.alertcontroller.create({
      header: "New Item",
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