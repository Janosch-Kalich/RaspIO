import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { RequestsService } from '../requests.service';

@Component({
  selector: 'app-new-ws',
  templateUrl: './new-ws.component.html',
  styleUrls: ['./new-ws.component.scss'],
})

export class NewWSComponent implements OnInit, AfterViewInit {
  @ViewChild("slides") slides: IonSlides;
  url: string;
  devices: any[];
  device: any;
  ws: any = {};
  response: any = { msg: "", method: "" };

  constructor(private http: HttpClient, private storage: Storage, private requests: RequestsService, private router: Router) { }

  ngOnInit() {
    this.requests.storageinit().then((url) => {
      this.url = this.requests.url = url;
      this.http.post("http://" + this.url + "/scan", {}).subscribe((devices: any[]) => {
        console.log(devices);
        this.devices = devices;
      })
    })
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
    console.log({ "hostname": this.device.name, "ip": this.device.ip, "port": this.ws.port, "pref": this.ws.pref });
    this.http.post("http://" + this.url + "/testws", { "hostname": this.device.name, "ip": this.device.ip, "port": this.ws.port }).subscribe((res: any) => {
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

  add(){
    this.http.post("http://" + this.url + "/addws", {
      "name": this.ws.name,  
      "hostname": this.device.name,
      "ip": this.device.ip,
      "port": this.ws.port,
      "pref": this.ws.pref
    }).subscribe(res => {
        this.router.navigate(["wsdetails"], { queryParams: { id: res["id"]} });
    })
  }
}
