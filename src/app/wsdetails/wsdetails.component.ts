import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestsService } from '../requests.service';

@Component({
  selector: 'app-wsdetails',
  templateUrl: './wsdetails.component.html',
  styleUrls: ['./wsdetails.component.scss'],
})
export class WSDetailsComponent implements OnInit {
  constructor(private route: ActivatedRoute, private requests: RequestsService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.requests.storageinit().then(url => {
        this.requests.url = url;
        this.requests.getWS(params["id"]).then(ws => {
          console.log(ws);
        });
      });
    });
  }

  //temp
  back(){
    console.log("back");
  }
}