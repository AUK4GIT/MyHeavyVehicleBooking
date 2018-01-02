import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppModelServiceProvider, AppTrip, AppQuotation } from '../../providers/app-model-service/app-model-service'
import { DriverTripDetailsPage } from '../driver-trip-details/driver-trip-details'

@Component({
  selector: 'page-driver-trips-list',
  templateUrl: 'driver-trips-list.html',
})
export class DriverTripsListPage {
  items: AppQuotation[];
  constructor(private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DriverTripsListPage');
    this.items = this.appService.getConfirmedTripsforDriverId(this.appService.currentUser.userid);        
  }

  showTripDetails(trip){
    this.navCtrl.push(DriverTripDetailsPage, {
      trip: trip
    });
  }

}
