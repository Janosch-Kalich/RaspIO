import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';

import { IonicStorageModule } from '@ionic/storage-angular';
import { OverviewComponent } from './overview/overview.component';

@NgModule({
  declarations: [AppComponent, OverviewComponent],
  entryComponents: [],
  imports: [IonicModule.forRoot(), AppRoutingModule, HttpClientModule, IonicStorageModule.forRoot(), BrowserModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent]
})

export class AppModule {}
