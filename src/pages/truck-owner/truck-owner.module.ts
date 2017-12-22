import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TruckOwnerPage } from './truck-owner';
import { TranslateModule } from '@ngx-translate/core';
import { Ionic2RatingModule } from 'ionic2-rating';

import { OwnerTrucksListPage } from '../owner-trucks-list/owner-trucks-list';
import { DriversListPage } from '../drivers-list/drivers-list';
import { OffersListPage } from '../offers-list/offers-list';
import { OwnerTripsListPage } from '../owner-trips-list/owner-trips-list';
import { BookingsListPage } from '../bookings-list/bookings-list';
import { OwnerTripQuotationPage } from '../owner-trip-quotation/owner-trip-quotation';
import { OwnerAddDriverPage } from '../owner-add-driver/owner-add-driver';
import { OwnerAddTruckPage } from '../owner-add-truck/owner-add-truck';

@NgModule({
  declarations: [
    TruckOwnerPage,
    OwnerTrucksListPage,
    DriversListPage,
    OffersListPage,
    BookingsListPage,
    OwnerTripsListPage,
    OwnerTripQuotationPage,
    OwnerAddDriverPage,
    OwnerAddTruckPage
  ],
  imports: [
    IonicPageModule.forChild(TruckOwnerPage),
    TranslateModule,
    Ionic2RatingModule
  ],
  entryComponents: [
    TruckOwnerPage,
    OwnerTrucksListPage,
    DriversListPage,
    OffersListPage,
    BookingsListPage,
    OwnerTripsListPage,
    OwnerTripQuotationPage,
    OwnerAddDriverPage,
    OwnerAddTruckPage
  ]
})
export class TruckOwnerPageModule {}