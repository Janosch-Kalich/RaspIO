import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
})
export class NewComponent implements OnInit {
  pin: any = { name: "", pin: "", desc: "", type: "", default: "" }
  url: string;

  constructor(private http: HttpClient, private storage: Storage, private router: Router) { }

  ngOnInit() {
    this.storage.create();
    this.storage.get("url").then(url => {
      if(!url) this.router.navigate([""]);
    });
  }

  save(){
    for(let param in this.pin){
      if(this.pin[param] != "" || param == "desc"){

      }
      else{
        
      }
    }
  }
}
