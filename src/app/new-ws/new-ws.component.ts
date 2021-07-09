import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
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
  port: any;

  constructor(private http: HttpClient, private storage: Storage, private requests: RequestsService) { }

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
    console.log(device);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
    this.slides.updateAutoHeight();
    window.scrollTo(0, 0);
  }

  numbervalidation(event){
    const pattern = /[0-9]/;
    let inputchar = String.fromCharCode(event.charCode);

    if(!pattern.test(inputchar)){
      event.preventDefault();
    }
  }
}
