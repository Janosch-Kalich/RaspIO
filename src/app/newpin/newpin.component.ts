import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-new',
  templateUrl: './newpin.component.html',
  styleUrls: ['./newpin.component.scss'],
})
export class NewPinComponent implements OnInit {
  pin: any = { name: "", pin: "", desc: "", type: "", default: "" }
  url: string;
  pins: any[] = [3, 5, 7, 8, 10, 11,12, 13, 15, 16, 18, 19, 21, 22, 23, 24, 26, 27, 28, 29, 31, 32, 33, 35, 36, 37, 38, 40];

  constructor(private http: HttpClient, private storage: Storage, private router: Router, private alertcontroller: AlertController) { }

  ngOnInit() {
    this.storage.create();
    this.storage.get("url").then(url => {
      if(!url) this.router.navigate([""]);
      else{
        this.url = url;
      }
    });
  }

  save(){
    let empty = false;
    for(let param in this.pin){
      if(this.pin[param] != "" || param == "desc" || param == "default"){
      }
      else{
        empty = true;
      }
    }
    if(empty){
      this.alertcontroller.create({
        header: "Can't save",
        message: "This field must not be empty",
        buttons: [
          {
            text: "OK"
          }
        ]
      }).then(alert => {
        alert.present();
      });
    }
    else{
      console.log(this.pin);
      this.http.post(this.url + "/addpin", this.pin).subscribe(res => {
        console.log(res);
        if(res["id"]) this.router.navigate(["pindetails"], { queryParams: { id: res["id"] } });
      })
    }
  }
}
