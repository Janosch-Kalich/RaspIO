import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RequestsService implements OnInit {
  public url: string;

  constructor(private http: HttpClient, private alertcontroller: AlertController, private storage: Storage, private router: Router) { }

  ngOnInit(){
    
  }

  async storageinit(): Promise<any>{
    this.storage.create();
    return this.storage.get("url");
  }

  async configalert(handler: (any)): Promise<any>{
    this.alertcontroller.create({
    header: "Raspberry Pi URL",
    message: "Enter the URL and port of the Raspberry Pi you want to control",
    inputs: [
      {
        name: "url",
        type: "text",
        placeholder: "raspberrypi:1234"
      }
    ],
    buttons: [
      {
        text: "Save",
        handler: handler
      }
      ]
    }).then((alert) => {
      return alert.present();
    });
  }

  public async getPin(id){
    return await this.http.post("http://" + this.url + "/getpin", { "id": id }).toPromise();
  }

  public async getWS(id){
    return await this.http.post("http://" + this.url + "/getws", { "id": id}).toPromise();
  }

  public async getAll(){
    return await this.http.post("http://" + this.url, {}).toPromise();
  }

  async connectionerror(){
    await this.alertcontroller.create({
    header: "Couldn't connect",
    message: "Couldn't connect to the specified Raspberry Pi",
    buttons: [
      {
        "text": "OK",
      }
    ]
  }).then((alert) => {
    alert.present();
  });
  }

  connectionsucces(pins){
    let idarray = [];
    for(let pin in pins.pins){
      console.log(pin)
      idarray.push(pin);
    }

    return { "idarray": idarray, "pins": pins };
  }
  
  public async savepin(url, id, attr, val, pin, pincopy){
    console.log(pincopy[attr]);
    if(val || attr == "desc" || attr == "default"){
      pincopy[attr] = val;
      let data = { id: id, props: {  }};
      data.props[attr] = val;
      this.http.post("http://" + this.url + "/setpin", data).subscribe(res => {
        return res;
      });
    }
    else{
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
        return pincopy;
      })
    }
    return pincopy;
  }

  public async setpin(id, pin, state){
    return await this.http.post("http://" + this.url + "/setpin", { id: id, state: state }).toPromise();
  }

  delete(id){
    this.alertcontroller.create({
      header: "Delete?",
      message: "Do you really want to delete this pin, this action cannot be undone",
      buttons:[
        {
          text: "Cancel",
          role: "cancel"
        },
        {
          text: "Confirm",
          handler: () => {
            this.http.post("http://" + this.url + "/delete", { id: id }).subscribe(res => {
              if(res) this.router.navigate([""]);
            });
          }
        }
      ]
    }).then(alert => {
      alert.present();
    });
  }
}
