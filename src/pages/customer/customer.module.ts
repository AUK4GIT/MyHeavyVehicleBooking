import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { CustomerPage } from './customer';
import { CustomerTripsListPage } from '../customer-trips-list/customer-trips-list';
import { CustomerBookingsListPage } from '../customer-bookings-list/customer-bookings-list';

import { CustomerAddNewTripPage } from '../customer-add-new-trip/customer-add-new-trip';
import { CustomerViewQuotationsPage } from '../customer-view-quotations/customer-view-quotations';

@NgModule({
  declarations: [
    CustomerPage,
    CustomerTripsListPage,
    CustomerBookingsListPage,
    CustomerAddNewTripPage,
    CustomerViewQuotationsPage
  ],
  imports: [
    IonicPageModule.forChild(CustomerPage),
    TranslateModule
  ],
  entryComponents: [
    CustomerTripsListPage,
    CustomerBookingsListPage,
    CustomerAddNewTripPage,
    CustomerViewQuotationsPage
  ]
})
export class CustomerPageModule {}
