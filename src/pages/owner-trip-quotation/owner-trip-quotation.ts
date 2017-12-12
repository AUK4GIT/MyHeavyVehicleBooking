import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppModelServiceProvider, AppUser, AppTruck } from '../../providers/app-model-service/app-model-service'

@Component({
  selector: 'page-owner-trip-quotation',
  templateUrl: 'owner-trip-quotation.html',
})
export class OwnerTripQuotationPage {
driver: string;
cost: string;
starttime: string;
closetime: string;
comments: string;
charges: string;
truckdetails: string;
tripid: string;
trucktype: string;
duration: string;
drivers: AppUser[];
trucks: AppTruck[];

  constructor(private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.tripid = this.navParams["tripid"];
    this.trucktype = this.navParams["trucktype"];
    this.drivers = this.appService.getDriversForOwner(this.appService.currentUser.userid);
    this.trucks = this.appService.getTrucksForOwnerid(this.appService.currentUser.userid);
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OwnerTripQuotationPage');
  }

  focusFunction() {
  }

  addQuote() {
    if(this.cost && this.starttime){
      this.appService.addQuotationForTrip({
        truck: this.trucktype,
        driver: this.driver,
        duration: this.duration,
        cost: this.cost,
        status: "",
        starttime: this.starttime,
        closetime: this.closetime,
        additionalcharges: this.charges,
        comments: this.comments,
        offers: null,
        tripid: this.tripid,
        ownerid: this.appService.currentUser.userid,
        truckregno: this.truckdetails
    });
    }      
  }

}
