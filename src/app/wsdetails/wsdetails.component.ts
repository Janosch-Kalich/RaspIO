import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Event, Router } from '@angular/router';
import { RequestsService } from '../requests.service';
import { Subscription } from 'rxjs';
import { AlertController, Animation, AnimationController, IonSlide, IonSlides, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-wsdetails',
  templateUrl: './wsdetails.component.html',
  styleUrls: ['./wsdetails.component.scss'],
})

export class WSDetailsComponent implements OnInit, OnDestroy{
  @ViewChild("slides") slides: IonSlides;

  hiddenoutput: any = {};
  id: string;
  wsdetails: any = { readyState: 0 };
  prevrs: number;
  outputidarray: any[] = [];
  inputidarray: any[] = [];
  wssub: Subscription;
  
  constructor(private route: ActivatedRoute, private requests: RequestsService, private router: Router, private wss: WebsocketService, private http: HttpClient, private toastcontroller: ToastController, private animationcontroller: AnimationController, private alertcontroller: AlertController) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params["id"];
      this.requests.storageinit().then(url => {
        this.requests.url = url;
        this.requests.getWS(params["id"]).then(ws => {
          this.wsdetails = ws;
          if(!this.wsdetails.input) this.wsdetails.input = {};
          this.inputidarray = [];
          this.outputidarray = [];
          for(let valueid in this.wsdetails.input){
            this.inputidarray.push(valueid);
            if(!this.wsdetails.input[valueid]) this.wsdetails.input[valueid] = {};
          }
          for(let outputid in this.wsdetails.output){
            this.outputidarray.push(outputid);
            if(!this.wsdetails.output[outputid]) this.wsdetails.output[outputid] = {};
            this.hiddenoutput[outputid] = true;
          }
          console.log(ws);
          console.log(this.inputidarray);
          this.connectws(url, this.id);
        });
      });
    });
  }
  
  toggleoutputdisplay(i){
    console.log(this.wsdetails.output[i].hidden);
    this.hiddenoutput[i] = !this.hiddenoutput[i];
  }

  checknumber(id, pattern, min, max, event){
    pattern = RegExp(pattern);
    let value = this.wsdetails.output[id].data.value.toString() + event.key.toString();

    console.log(value);

    if(min > parseInt(value) || max < parseInt(value) || !pattern.test(event.key) && event.key.length == 1){
      event.preventDefault();
    }
  }

  save(attr, val, extras?){
    //this.wss.close();
    //this.wsobs.unsubscribe();
    let data = { id: this.id, props: {} };
    if(extras) data["extras"] = extras;
    data.props[attr] = val;
    this.http.post(this.requests.url + "/setws", data).subscribe(res => {
      for(let attrs in res){
        if(attrs != "values") this.wsdetails[attrs] = res[attrs];
      }
      console.log(this.wsdetails);
      //this.connectws(this.requests.url, this.id);
    });
  }

  addwsoutput(){
    this.http.post(this.requests.url + "/addwsoutput", { wsid: this.id}).subscribe(res => {
      this.outputidarray.push(res["id"]);
      this.wsdetails.output[res["id"]] = res["data"];
    });
  }

  savewsoutput(outputid, attr, val){
    console.log(this.wsdetails.output);
    let data = { id: this.id, outputid: outputid, props: {} };
    if(attr == "type"){
      this.wsdetails.output[outputid].data.value = "";
      data.props["value"] = this.wsdetails.output[outputid].data.value;
    }
    data.props[attr] = val;
    this.http.post(this.requests.url + "/setwsoutput", data).subscribe(res => {
      for(let attrs in res){
        if(attrs != "values") this.wsdetails[attrs] = res[attrs];
      }
      console.log(this.wsdetails.output);
      console.log(this.wsdetails);
    });
  }

  executeoutput(outputid){
    let data = { id: this.id, data: JSON.parse(JSON.stringify(this.wsdetails.output[outputid].data)) };
    data.data["id"] = parseInt(this.wsdetails.output[outputid].data.id);
    if(this.wsdetails.output[outputid].data.type == 0) data.data["value"] = this.wsdetails.output[outputid].data.value == true ? "1" : "0";
    console.log(data);
    
    this.http.post(this.requests.url + "/executewsoutput", data).subscribe(res => {
      console.log(res);
    });
  }

  checkid(event){
    console.log(event);
    if(/[a-z|A-Z]/.test(event.key) && event.key.length == 1){
      event.preventDefault();
    }
  }

  back(){
    try{
      this.wss.close();
    }
    catch(e){
      console.log(e);
    }
    this.router.navigate(["/overview"]).then(() => {
      this.requests.getAll();
    });
  }

  @HostListener("unloaded")
  ngOnDestroy(){
    console.log("AA");
  }

  connectws(url, id){
    this.wssub = this.wss.connect(url, { "id": id, "action": "get", "type": "ws" }).subscribe(val => {
      let data = JSON.parse(val.data);
      console.log(data);
      if(this.wsdetails["readyState"] != data.wsc["_readyState"]){
        switch(data.wsc["_readyState"] ){
          case 0:
            this.toastcontroller.create({
              header: "Connecting...",
              duration: 2000
            }).then(toast => {
              toast.present();
            });
          break;
          case 1:
            this.toastcontroller.create({
              header: "Connected",
              duration: 2000
            }).then(toast => {
              toast.present();
            });
            break;
          case 3:
            this.toastcontroller.create({
              header: "Disconnected / Failed to connect",
              duration: 2000
            }).then(toast => {
              toast.present();
            });
            break;
        }
      }
      this.wsdetails.values = data["values"];
      this.wsdetails.readyState = data.wsc["_readyState"];
      this.wsdetails.input = data["input"];
      for(let elem in this.wsdetails["input"]){
        if(!this.inputidarray.includes(elem)) this.inputidarray.push(elem);
      }
    });
  }

  connectextws(){
    this.wss.close();
    this.connectws(this.requests.url, this.id);
    this.http.post(this.requests.url + "/connectws", { id: this.id }).subscribe(res => {
      console.log(res);
    });
  }

  deletewsinput(inputid){
    this.http.post(this.requests.url + "/deletewsinput", { wsid: this.id, inputid: inputid }).subscribe(res => {
      delete this.wsdetails.input[inputid];
      this.inputidarray.splice(this.inputidarray.indexOf(inputid));
      console.log(res);
    });
  }

  deletewsoutput(outputid){
    this.http.post(this.requests.url + "/deletewsoutput", { wsid: this.id, outputid: outputid }).subscribe(res => {
      delete this.wsdetails.output[outputid];
      this. outputidarray.splice(this.outputidarray.indexOf(outputid));
      console.log(res);
    });
  }

  savewsinput(inputid, attr, val){
    this.wss.close();
    let data = { wsid: this.id, inputid: inputid, props: {} };
    data.props[attr] = val;
    console.log(data);
    this.http.post(this.requests.url + "/setwsinput", data).subscribe(res => {
      for(let attrs in res){
        if(attrs != "values") this.wsdetails[attrs] = res[attrs];
      }
      console.log(this.wsdetails);
      this.connectws(this.requests.url, this.id);
    });
  }

  deletews(){
    this.alertcontroller.create({
      header: "Delete " + this.wsdetails.name + "?",
      message: "This action cannot be undone",
      buttons: [
        {
          text: "Cancel",
          handler: () => {}
        },
        {
          text: "OK",
          handler: () => {
            this.http.post(this.requests.url + "/deletews", { id: this.id }).subscribe((res) => {
              if(res) this.back();
            })
          }
        }
      ]
    }).then(alert => {
      alert.present();
    });
  }

  opentab(i){
    console.log(i);
    this.slides.slideTo(i);
  }
}