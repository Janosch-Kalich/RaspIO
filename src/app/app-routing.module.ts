import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PinDetailsComponent } from './pindetails/pindetails.component';
import { NewPinComponent } from './newpin/newpin.component';
import { OverviewComponent } from './overview/overview.component';
import { SettingsComponent } from './settings/settings.component';
import { NewWSComponent } from './new-ws/new-ws.component';
import { WSDetailsComponent } from './wsdetails/wsdetails.component';

const routes: Routes = [
  {
    path: 'overview',
    component: OverviewComponent
  },
  {
    path: 'pindetails',
    data: ['id'],
    component: PinDetailsComponent
  },
  {
    path: 'newpin',
    component: NewPinComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'newws',
    component: NewWSComponent
  },
  {
    path: 'wsdetails',
    data: ['id'],
    component: WSDetailsComponent
  },
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
