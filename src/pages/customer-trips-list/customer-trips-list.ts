import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppModelServiceProvider, AppTruck, AppTrip } from '../../providers/app-model-service/app-model-service'

import { CustomerAddNewTripPage } from '../customer-add-new-trip/customer-add-new-trip';
import { CustomerViewQuotationsPage } from '../customer-view-quotations/customer-view-quotations';

@Component({
  selector: 'page-customer-trips-list',
  templateUrl: 'customer-trips-list.html',
})
export class CustomerTripsListPage {
  items: AppTrip[];
  constructor(private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad CustomerTripsListPage');
    this.items = this.appService.getTripsForCustomerid(this.appService.currentUser.userid);    
  }

  addNewTrip(){
    this.navCtrl.push(CustomerAddNewTripPage);
  }

  viewQuotationsForTrip(trip) {
    console.log("trip: "+trip);
    this.navCtrl.push(CustomerViewQuotationsPage, { trip: trip});    
  }

}
