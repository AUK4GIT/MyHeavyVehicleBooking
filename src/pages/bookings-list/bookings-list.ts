import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppModelServiceProvider, AppTrip } from '../../providers/app-model-service/app-model-service'
import { OwnerTripQuotationPage } from '../owner-trip-quotation/owner-trip-quotation';
import { OwnerCreateTripPage } from '../owner-create-trip/owner-create-trip'

/**
 * Generated class for the BookingsListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-bookings-list',
  templateUrl: 'bookings-list.html',
})
export class BookingsListPage {
  items: AppTrip[];
  constructor(private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidEnter() {
    this.items = this.appService.getRequestedTripsForOwnerid(this.appService.currentUser.userid);            
    console.log('ionViewDidLoad OwnerTripsListPage');
  }

  giveQuotationsForTrip(trip) {
    this.navCtrl.push(OwnerTripQuotationPage, { tripid: trip.tripid, trucktype: trip.trucktype, status: trip.status});    
  }

}
