import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { IonicImageLoader } from 'ionic-image-loader';

import { DriverPage } from './driver';
import { DriverTripsListPage } from '../driver-trips-list/driver-trips-list';
import { DriverBookingsListPage } from '../driver-bookings-list/driver-bookings-list';
import { DriverTripDetailsPage } from '../driver-trip-details/driver-trip-details'

@NgModule({
  declarations: [
    DriverPage,
    DriverTripsListPage,
    DriverBookingsListPage,
    DriverTripDetailsPage
  ],
  imports: [
    IonicPageModule.forChild(DriverPage),
    TranslateModule,
    IonicImageLoader
  ],
  entryComponents: [
    DriverPage,
    DriverTripsListPage,
    DriverBookingsListPage,
    DriverTripDetailsPage
  ]
})
export class DriverPageModule {}
