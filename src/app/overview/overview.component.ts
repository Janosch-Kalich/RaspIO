import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { AlertController, iosTransitionAnimation } from '@ionic/angular';
import { NavigationEnd, Router } from '@angular/router';
import { RequestsService } from '../requests.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})

export class OverviewComponent implements OnInit, OnDestroy{
  title: string = "Overview";

  constructor(private http: HttpClient, private storage: Storage, private alertcontroller: AlertController, private router: Router, private requests: RequestsService) {}

  init(){
    this.requests.storageinit().then(url => {
      this.requests.url = url;
      if(!url){
        this.requests.configalert((data) => {
          console.log(data.url);
          this.storage.set("url", data.url).then(() => {
            this.requests.url = data.url;
            this.requests.getAll();
          });
        });
      }
      else {
        this.requests.getAll();
      }
    });
  }

  @HostListener("unloaded")
  ngOnDestroy(){
    console.log("AAA");
  }

  refresh(e?){
    this.init();
    if(e) setTimeout(() => { e.target.complete(); }, 500);
  }

  ngOnInit() {
    this.init();
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
    this.router.navigateByUrl("/newpin");
  }

  newWS(){
    this.router.navigateByUrl("/newws");
  }

  a(){
    console.log("aaa");
  }
}