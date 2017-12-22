import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AppModelServiceProvider, AppTrip, AppQuotation, AppTruck, AppUser } from '../../providers/app-model-service/app-model-service'

@Component({
  selector: 'page-driver-trip-details',
  templateUrl: 'driver-trip-details.html',
})
export class DriverTripDetailsPage {

  quotation: AppQuotation;
  truckdetails: AppTruck;
  customer: AppUser;
  trip: AppTrip;
  comments: string;
  charges: string;

  constructor(private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.trip = this.navParams.get('trip');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DriverTripDetailsPage');
    this.quotation = this.appService.getConfirmedQuotationForTripId(this.trip.tripid);
    this.customer = this.appService.getUserById(this.trip.userid);
    this.truckdetails = this.appService.getTruckForTripId(this.quotation.truckid);
  }

  completeTrip(){
    this.quotation.comments = this.comments;
    this.quotation.additionalcharges = this.charges;
    this.appService.completeTripWithId(this.trip.tripid, this.quotation.quotationid);
    this.presentConfirm();
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Rent a Truck',
      message: 'Trip Completed Successfully',
      buttons: [
        {
          text: "OK",
          role: 'cancel',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }

}
