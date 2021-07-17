import { Injectable, OnInit } from '@angular/core';
import * as Rx from 'rxjs';
import { Buffer } from 'buffer';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService{
  private ws: WebSocket;
  private subject: Rx.Subject<MessageEvent>;
  constructor() { }

  public connect(url, msg): Rx.Subject<MessageEvent>{
    console.log(msg);
    if(!this.subject){
      this.subject = this.create(url, msg);
      console.log("Connected " + url);
    }
    return this.subject;
  }

  private create(url, msg): Rx.Subject<MessageEvent>{
    this.ws = new WebSocket("ws://" + url);

    console.log("BBB");

    let observable = new Rx.Observable((obs: Rx.Observer<MessageEvent>) => {
      this.ws.onopen = () => {
        this.ws.send(Buffer.from(JSON.stringify(msg)));
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
        setTimeout(() => { this.create(url, msg) }, 5000);
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
    this.ws.send(Buffer.from(JSON.stringify({ "action": "stop" })));
    this.ws.close();
    this.subject = null;
  }
}