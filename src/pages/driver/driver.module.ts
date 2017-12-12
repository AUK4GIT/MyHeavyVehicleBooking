import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { DriverPage } from './driver';
import { DriverTripsListPage } from '../driver-trips-list/driver-trips-list';
import { DriverBookingsListPage } from '../driver-bookings-list/driver-bookings-list';

@NgModule({
  declarations: [
    DriverPage,
    DriverTripsListPage,
    DriverBookingsListPage
  ],
  imports: [
    IonicPageModule.forChild(DriverPage),
    TranslateModule
  ],
  entryComponents: [
    DriverPage,
    DriverTripsListPage,
    DriverBookingsListPage
  ]
})
export class DriverPageModule {}
