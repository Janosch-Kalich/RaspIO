import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AlertController, AngularDelegate } from '@ionic/angular';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})

export class DetailsComponent implements OnInit {
  pin: any = { "name": "", "pin": "", "desc": "", "default": 0, "type": "out" };
  pincopy: any;
  id: string;
  url: string;
  constructor(private http: HttpClient, private storage: Storage, private router: Router, private route: ActivatedRoute, private alertcotroller: AlertController) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params["id"];
      this.storage.create();
      this.storage.get("url").then(url => {
        if(!url) this.router.navigate([""]);
        else{
          this.url = url;
          this.http.post("http://" + url + "/getpin", { "id": this.id }).subscribe(pin => {
            this.pin = JSON.parse(JSON.stringify(pin));
            
            this.pincopy = pin;
            console.log(this.pin);
          });
        }
      });  
    })
  }

  save(attr, val){
    console.log(this.pincopy[attr]);
    if(val || attr == "desc"){
      this.pincopy[attr] = val;
      let data = { id: this.id, props: {  }};
      data.props[attr] = val;
      this.http.post("http://" + this.url + "/set", data).subscribe(res => {
        console.log(res);
      });
    }
    else{
      this.alertcotroller.create({
        header: "Can't save",
        message: "This field must not be empty",
        buttons: [
          {
            text: "OK"
          }
        ]
      }).then(alert => {
        alert.present();
        this.pin[attr] = this.pincopy[attr];
      })
    }
  }

  setpin(state){
    this.http.post("http://" + this.url + "/setpin", { id: this.id, state: state }).subscribe(res => {
      console.log(res)
    });
  }
}
