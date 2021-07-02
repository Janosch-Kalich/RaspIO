import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AlertController, AngularDelegate } from '@ionic/angular';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { RequestsService } from '../requests.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})

export class DetailsComponent implements OnInit {
  //pin: any = { "name": "", "pin": "", "desc": "", "default": 0, "type": "out" };
  pin: any;
  pincopy: any;
  id: string;
  url: string;
  socket: WebSocketSubject<any>;

  pins: any[] = [3, 5, 7, 8, 10, 11,12, 13, 15, 16, 18, 19, 21, 22, 23, 24, 26, 27, 28, 29, 31, 32, 33, 35, 36, 37, 38, 40];
  
  constructor(private http: HttpClient, private storage: Storage, private router: Router, private route: ActivatedRoute, private alertcontroller: AlertController, private requests: RequestsService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params["id"];
      this.requests.storageinit().then(url => {
        this.requests.getPin(this.id).then(pin => {
          this.pin = pin;
          this.pincopy = JSON.parse(JSON.stringify(pin));
        })
      });
    });
  }

  save(attr, val){
    console.log(this.pin);
    this.requests.save(this.url, this.id, attr, val, this.pin, this.pincopy).then(pin => {
      this.pin = pin;
    }).catch(err => {
      throw err;
    })
  }

  setpin(state){
    this.requests.setpin(this.id, this.pin, state).then(pin => {
      this.pin = pin;
    })
  }

  connectws(){
    
  }
}
