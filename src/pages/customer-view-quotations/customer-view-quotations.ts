import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppModelServiceProvider, AppQuotation, AppTrip } from '../../providers/app-model-service/app-model-service';
import { CustomerQuotationsDetailsPage } from '../customer-quotations-details/customer-quotations-details'
@Component({
  selector: 'page-customer-view-quotations',
  templateUrl: 'customer-view-quotations.html',
})
export class CustomerViewQuotationsPage {

  quotations: AppQuotation[];
  trip: AppTrip;
  constructor(private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  this.trip = this.navParams.get("trip");
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad CustomerViewQuotationsPage');
    this.quotations = this.appService.getQuotationsForTripId(this.trip.tripid);
  }

  navigateToQuotationDetails(quotation) {
    this.navCtrl.push(CustomerQuotationsDetailsPage, {
      quotation: quotation,
      trip: this.trip
    });
  }

}
