import { Injectable, OnInit } from '@angular/core';
import * as Rx from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService{
  private ws: WebSocket;
  private subject: Rx.Subject<MessageEvent>;
  constructor() { }

  public connect(url, pin): Rx.Subject<MessageEvent>{
    console.log(pin);
    if(!this.subject){
      this.subject = this.create(url, pin);
      console.log("Connected " + url);
    }
    return this.subject;
  }

  private create(url, pin): Rx.Subject<MessageEvent>{
    this.ws = new WebSocket("ws://" + url);

    console.log("BBB");

    let observable = new Rx.Observable((obs: Rx.Observer<MessageEvent>) => {
      this.ws.onopen = () => {
        this.ws.send(pin.toString());
      }
      this.ws.onmessage = obs.next.bind(obs);
      this.ws.onerror = obs.error.bind(obs);
      this.ws.onclose = obs.complete.bind(obs);
      return this.ws.close.bind(this.ws);
    });

    let observer = {
      next: (data: Object) => {
      },
      error: (err: Object) => {
        setTimeout(() => { this.create(url, pin) }, 5000);
        throw err;
      },
      complete: () => {
      }
    }

    let sub = new Rx.Subject<MessageEvent>();
    sub.subscribe(observer);
    observable.subscribe(sub);
    return sub;
  }
  
  close(){
    this.ws.send("STOP");
    this.ws.close();
    this.subject = null;
  }
}