import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { AdminPage } from './admin';
import { DateToIsoPipe } from '../../pipes/date-to-iso/date-to-iso'
import { Ionic2RatingModule } from 'ionic2-rating';

import { TrucksListPage } from '../trucks-list/trucks-list';
import { TruckOwnersListPage } from '../truck-owners-list/truck-owners-list';
import { CustomersListPage } from '../customers-list/customers-list';
import { TripsListPage } from '../trips-list/trips-list';
import { AdminOffersListPage } from '../admin-offers-list/admin-offers-list';
import { AdminDriversListPage } from '../admin-drivers-list/admin-drivers-list';
import { CitiesPage } from '../cities/cities';
import { TruckTypesPage } from '../truck-types/truck-types';
import { AddTruckTypePage } from '../add-truck-type/add-truck-type'
import { AdminCustomerTripsListPage } from '../admin-customer-trips-list/admin-customer-trips-list'
import { AdminOwnerTripsListPage } from '../admin-owner-trips-list/admin-owner-trips-list'
import { AdminTripDetailsPage } from '../admin-trip-details/admin-trip-details'
import { AdminUpdateVatPage } from '../admin-update-vat/admin-update-vat'
import { AdminCreateUserPage } from '../admin-create-user/admin-create-user'

@NgModule({
  declarations: [
    AdminPage,
    TrucksListPage,
    TruckOwnersListPage,
    CustomersListPage,
    TripsListPage,
    AdminOffersListPage,
    AdminDriversListPage,
    CitiesPage,
    TruckTypesPage,
    AddTruckTypePage,
    DateToIsoPipe,
    AdminCustomerTripsListPage,
    AdminOwnerTripsListPage,
    AdminTripDetailsPage,
    AdminUpdateVatPage,
    AdminCreateUserPage
  ],
  imports: [
    IonicPageModule.forChild(AdminPage),
    TranslateModule,
    Ionic2RatingModule
  ],
  entryComponents: [
    AdminPage,
    TrucksListPage,
    TruckOwnersListPage,
    CustomersListPage,
    TripsListPage,
    AdminOffersListPage,
    AdminDriversListPage,
    CitiesPage,
    TruckTypesPage,
    AddTruckTypePage,
    AdminOwnerTripsListPage,
    AdminCustomerTripsListPage,
    AdminTripDetailsPage,
    AdminUpdateVatPage,
    AdminCreateUserPage
  ],
  exports: [DateToIsoPipe]
})
export class AdminPageModule {}
