import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AlertController, AngularDelegate } from '@ionic/angular';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { RequestsService } from '../requests.service';
import { WebsocketService } from '../websocket.service';
import { Observable, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-pindetails',
  templateUrl: './pindetails.component.html',
  styleUrls: ['./pindetails.component.scss'],
})

export class PinDetailsComponent implements OnInit {
  //pin: any = { "name": "", "pin": "", "desc": "", "default": 0, "type": "out" };
  pin: any;
  pincopy: any;
  id: string;
  url: string;
  socket: WebSocketSubject<any>;
  wsobs: Subscription;

  pins: any[] = [3, 5, 7, 8, 10, 11,12, 13, 15, 16, 18, 19, 21, 22, 23, 24, 26, 27, 28, 29, 31, 32, 33, 35, 36, 37, 38, 40];
  
  constructor(private http: HttpClient, private storage: Storage, private router: Router, private route: ActivatedRoute, private alertcontroller: AlertController, private requests: RequestsService, private ws: WebsocketService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params["id"];
      this.requests.storageinit().then(url => {
        this.url = this.requests.url = url
        this.requests.getPin(this.id).then(pin => {
          this.pin = pin;
          this.pincopy = JSON.parse(JSON.stringify(pin));
          this.connectws();
        });
      });
    });
  }

  save(attr, val){
    this.ws.close();
    console.log(this.pin);
    //this.wsobs.unsubscribe();
    console.log(this.pin.state);
    this.requests.save(this.url, this.id, attr, val, this.pin, this.pincopy).then(pin => {
      this.pin = pin;
      console.log(this.pin.state);
      this.pincopy = JSON.parse(JSON.stringify(pin));
      this.connectws();
    }).catch(err => {
      throw err;
    });
  }

  setpin(state){
    this.requests.setpin(this.id, this.pin, state).then(pin => {
      this.pin = pin;
    })
  }

  connectws(){
    console.log(this.pin.pin);
    this.wsobs = this.ws.connect(this.requests.url, { "pin": this.pin.pin.toString(), "action": "get", "type": "pin" }).subscribe(val => {
      console.log(val.data);
      this.pin.state = parseInt(val.data);
    });
  }

  back(){
    this.ws.close();
    this.router.navigate(['']);
  }
}
