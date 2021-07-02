import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  url: any;

  constructor(private http: HttpClient, private storage: Storage, private router: Router) { }

  ngOnInit() {
    this.storage.create();
    this.storage.get("url").then(url => {
      this.url = url;
    })
  }

  save(){
    this.storage.set("url", this.url);
  }
}
