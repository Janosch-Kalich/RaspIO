import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})

export class OverviewComponent implements OnInit {
  title: string = "Overview";
  pins: any;
  idarray: any[] = [];

  constructor(private http: HttpClient, private storage: Storage, private alertcontroller: AlertController) {}

  ngOnInit() {
    this.storage.create();
    this.storage.get("url").then((url) => {
      if(!url){
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
              handler: (data) => {
                this.storage.set("url", data.url);
                this.http.post("http://" + data.url, {}).subscribe((pinobj) => {
                  this.connectionsucces(pinobj);
                }, () => this.connectionerror()
                );
              }
            }
          ]
          }).then((alert) => {
            alert.present();
          });
        }
        else{
          this.http.post("http://" + url, {}).subscribe((pinobj) => {
            this.connectionsucces(pinobj);
          }, () => this.connectionerror()
        );
      }
    });
  }

  connectionerror(){
    this.alertcontroller.create({
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
    this.pins = pins;
    for(let pin in this.pins.pins){
      console.log(pin)
      this.idarray.push(pin);
    }
  }
}