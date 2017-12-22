import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppModelServiceProvider, AppTrip } from '../../providers/app-model-service/app-model-service'
import { OwnerTripQuotationPage } from '../owner-trip-quotation/owner-trip-quotation';

@Component({
  selector: 'page-owner-trips-list',
  templateUrl: 'owner-trips-list.html',
})
export class OwnerTripsListPage {
  items: AppTrip[];
  constructor(private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidEnter() {
    this.items = this.appService.getTrips();            
    console.log('ionViewDidLoad OwnerTripsListPage');
  }

  giveQuotationsForTrip(trip) {
    this.navCtrl.push(OwnerTripQuotationPage, { tripid: trip.tripid, trucktype: trip.trucktype});    
  }

}
