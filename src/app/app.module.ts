import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClient, HttpClientModule } from '@angular/common/http';

import { IonicStorageModule } from '@ionic/storage-angular';
import { OverviewComponent } from './overview/overview.component';
import { PinDetailsComponent } from './pindetails/pindetails.component';
import { FormsModule } from '@angular/forms';
import { NewPinComponent } from './newpin/newpin.component';
import { SettingsComponent } from './settings/settings.component';
import { NewWSComponent } from './new-ws/new-ws.component';
import { WSDetailsComponent } from './wsdetails/wsdetails.component';

@NgModule({
  declarations: [AppComponent, OverviewComponent, PinDetailsComponent, NewPinComponent, SettingsComponent, NewWSComponent, WSDetailsComponent],
  entryComponents: [],
  imports: [IonicModule.forRoot(), AppRoutingModule, HttpClientModule, IonicStorageModule.forRoot(), BrowserModule, FormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent]
})

export class AppModule {}
