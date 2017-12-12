import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { AdminPage } from './admin';

import { TrucksListPage } from '../trucks-list/trucks-list';
import { TruckOwnersListPage } from '../truck-owners-list/truck-owners-list';
import { CustomersListPage } from '../customers-list/customers-list';
import { TripsListPage } from '../trips-list/trips-list';

@NgModule({
  declarations: [
    AdminPage,
    TrucksListPage,
    TruckOwnersListPage,
    CustomersListPage,
    TripsListPage
  ],
  imports: [
    IonicPageModule.forChild(AdminPage),
    TranslateModule,
    
  ],
  entryComponents: [
    AdminPage,
    TrucksListPage,
    TruckOwnersListPage,
    CustomersListPage,
    TripsListPage
  ]
})
export class AdminPageModule {}
