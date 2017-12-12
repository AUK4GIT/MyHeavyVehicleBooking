import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppModelServiceProvider, AppQuotation } from '../../providers/app-model-service/app-model-service';

@Component({
  selector: 'page-customer-view-quotations',
  templateUrl: 'customer-view-quotations.html',
})
export class CustomerViewQuotationsPage {

  quotations: AppQuotation[];
  tripid: string;
  constructor(private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  this.tripid = this.navParams["tripid"];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerViewQuotationsPage');
    this.quotations = this.appService.getQuotationsForTripId(this.tripid);
  }

}
