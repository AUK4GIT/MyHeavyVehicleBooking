import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppModelServiceProvider, AppTrip } from '../../providers/app-model-service/app-model-service'

/**
 * Generated class for the CustomerBookingsListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-customer-bookings-list',
  templateUrl: 'customer-bookings-list.html',
})
export class CustomerBookingsListPage {
  items: AppTrip[];
  constructor(private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.items = this.appService.getRequestedTripsForUserId(this.appService.currentUser.userid);        
    console.log('ionViewDidLoad CustomerBookingsListPage');
  }

}
