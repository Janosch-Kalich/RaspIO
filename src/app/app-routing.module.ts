import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { NewPinComponent } from './newpin/newpin.component';
import { OverviewComponent } from './overview/overview.component';
import { SettingsComponent } from './settings/settings.component';
import { NewWSComponent } from './new-ws/new-ws.component';

const routes: Routes = [
  {
    path: 'overview',
    component: OverviewComponent
  },
  {
    path: 'details',
    data: ['id'],
    component: DetailsComponent
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
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
