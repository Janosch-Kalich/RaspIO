import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';

import { IonicStorageModule } from '@ionic/storage-angular';
import { OverviewComponent } from './overview/overview.component';
import { DetailsComponent } from './details/details.component';
import { FormsModule } from '@angular/forms';
import { NewPinComponent } from './newpin/newpin.component';
import { SettingsComponent } from './settings/settings.component';
import { NewWSComponent } from './new-ws/new-ws.component';

@NgModule({
  declarations: [AppComponent, OverviewComponent, DetailsComponent, NewPinComponent, SettingsComponent, NewWSComponent],
  entryComponents: [],
  imports: [IonicModule.forRoot(), AppRoutingModule, HttpClientModule, IonicStorageModule.forRoot(), BrowserModule, FormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent]
})

export class AppModule {}
