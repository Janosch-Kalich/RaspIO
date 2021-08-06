import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonSlides } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { RequestsService } from '../requests.service';

@Component({
  selector: 'app-new-ws',
  templateUrl: './new-ws.component.html',
  styleUrls: ['./new-ws.component.scss'],
})

export class NewWSComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("slides") slides: IonSlides;
  url: string;
  devices: any[];
  device: any;
  ws: any = {};
  response: any = { msg: "", method: "" };

  constructor(private http: HttpClient, private storage: Storage, private requests: RequestsService, private router: Router, private alertcontroller: AlertController) { }

  ngOnInit() {
    this.requests.storageinit().then((url) => {
      this.url = this.requests.url = url;
      this.http.post(this.url + "/scan", {}).subscribe((devices: any[]) => {
        console.log(devices);
        this.devices = devices;
      })
    })
  }

  @HostListener("unloaded")
  ngOnDestroy(){
    console.log("AAA");
  }

  ngAfterViewInit(){
    this.slides.lockSwipes(true);
  }

  selectdev(device){
    this.slides.lockSwipes(false);
    this.device = device;
    this.slides.slideNext();
    this.slides.lockSwipes(true);
    this.slides.updateAutoHeight();
  }

  numbervalidation(event){
    const pattern = /[0-9]/;
    let inputchar = String.fromCharCode(event.charCode);

    if(!pattern.test(inputchar)){
      event.preventDefault();
    }
  }

  test(){
    if(!(this.ws.name == undefined || this.ws.port == undefined)){
      console.log({ "hostname": this.device.name, "ip": this.device.ip, "port": this.ws.port, "pref": this.ws.pref });
      this.http.post(this.url + "/testws", { "hostname": this.device.name, "ip": this.device.ip, "port": this.ws.port }).subscribe((res: any) => {
        console.log(res);
        if(res.msg){
          this.response.msg = res.msg;
          this.response.method = res.method;
          this.slides.lockSwipes(false);
          this.slides.slideNext();
          this.slides.lockSwipes(true);
        }
        else if(res.error){

        }
      });
    }
    else{
      this.alertcontroller.create({
        header: "Can't connnect.",
        message: this.ws.name == undefined ? "Name cannot be empty." : "Port cannot be empty.",
        buttons: [
          {
            text: "OK"
          }
        ]
      }).then(alert => {
        alert.present();
      });
    }
  }

  add(){
    this.http.post(this.url + "/addws", {
      "name": this.ws.name,
      "desc": this.ws.desc,
      "hostname": this.device.name,
      "ip": this.device.ip,
      "port": this.ws.port,
      "pref": this.response.method
    }).subscribe(res => {
        this.router.navigate(["/wsdetails"], { queryParams: { id: res["id"]} });
    })
  }

  back(){
    this.router.navigate(['/overview']).then(() => {
      this.requests.getAll();
    });
  }
}
