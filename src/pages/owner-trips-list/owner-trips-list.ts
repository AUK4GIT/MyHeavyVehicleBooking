import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppModelServiceProvider, AppTrip } from '../../providers/app-model-service/app-model-service'
// import { OwnerTripQuotationPage } from '../owner-trip-quotation/owner-trip-quotation';
import { OwnerCreateTripPage } from '../owner-create-trip/owner-create-trip'

@Component({
  selector: 'page-owner-trips-list',
  templateUrl: 'owner-trips-list.html',
})
export class OwnerTripsListPage {
  items: AppTrip[];
  constructor(private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidEnter() {
    this.items = this.appService.getOwnerAvailableTrips(this.appService.currentUser.userid);            
    console.log('ionViewDidLoad OwnerTripsListPage');
  }

  editTrip(trip) {
    // this.navCtrl.push(OwnerTripQuotationPage, { tripid: trip.tripid, trucktype: trip.trucktype});    
  }

  createTrip() {
    this.navCtrl.push(OwnerCreateTripPage);
  }
}
