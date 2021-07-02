import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';
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
      this.requests.getPins().then(pins => {
        this.pins = pins;
        for(let pin in pins["pins"]){
          this.idarray.push(pin);
        }
      })
    });

      //this.pins = res["pins"];
      //this.idarray = res["idarray"];
  }

  details(id){
    this.router.navigate(["details"], { queryParams: { id: id } });
  }

  new(){
    this.router.navigate(["new"]);
  }

  a(){
    console.log("aaa");
  }
}