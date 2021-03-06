import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { Ionic2RatingModule } from 'ionic2-rating';
import { IonicImageLoader } from 'ionic-image-loader';

import { CustomerPage } from './customer';
import { CustomerTripsListPage } from '../customer-trips-list/customer-trips-list';
import { CustomerBookingsListPage } from '../customer-bookings-list/customer-bookings-list';

import { CustomerAddNewTripPage } from '../customer-add-new-trip/customer-add-new-trip';
import { CustomerViewQuotationsPage } from '../customer-view-quotations/customer-view-quotations';
import { CustomerQuotationsDetailsPage } from '../customer-quotations-details/customer-quotations-details';
import { CustomerBookPredfinedTripPage } from '../customer-book-predfined-trip/customer-book-predfined-trip'
import { CustomerTripeRatingPage } from '../customer-tripe-rating/customer-tripe-rating'
import { SearchedTripModalPage } from "../searched-trip-modal/searched-trip-modal"
import { CustomerTripsOngoingListPage } from "../customer-trips-ongoing-list/customer-trips-ongoing-list";
import { PipesModule } from '../../pipes/pipes.module';


@NgModule({
  declarations: [
    CustomerPage,
    CustomerTripsListPage,
    CustomerBookingsListPage,
    CustomerAddNewTripPage,
    CustomerViewQuotationsPage,
    CustomerQuotationsDetailsPage,
    CustomerBookPredfinedTripPage,
    CustomerTripeRatingPage,
    SearchedTripModalPage,
    CustomerTripsOngoingListPage
  ],
  imports: [
    IonicPageModule.forChild(CustomerPage),
    TranslateModule,
    Ionic2RatingModule,
    IonicImageLoader,
    PipesModule
  ],
  entryComponents: [
    CustomerTripsListPage,
    CustomerBookingsListPage,
    CustomerAddNewTripPage,
    CustomerViewQuotationsPage,
    CustomerQuotationsDetailsPage,
    CustomerBookPredfinedTripPage,
    CustomerTripeRatingPage,
    SearchedTripModalPage,
    CustomerTripsOngoingListPage
  ]
})
export class CustomerPageModule {}
