import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AppModelServiceProvider, AppQuotation, AppUser, AppTrip } from '../../providers/app-model-service/app-model-service';

@Component({
  selector: 'page-customer-tripe-rating',
  templateUrl: 'customer-tripe-rating.html',
})
export class CustomerTripeRatingPage {

  quotation: AppQuotation;
  trip: AppTrip;
  owner: AppUser;
  driver: AppUser;
  constructor( private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.trip = this.navParams.get("trip");  
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad CustomerQuotationsDetailsPage');
    this.quotation = this.appService.getConfirmedQuotationForTripId(this.trip.tripid);
    this.owner = this.appService.getUserById(this.quotation.ownerid);
    this.driver = this.appService.getUserById(this.quotation.driver);
  }

  rateTheTrip(){
    
  }

  presentAlert(message, buttontexts, callback) {
    var buttons = [];
    var createCallback =  ( i ) => {
      return () => {
        if(callback) {
          callback(i);
        }
      }
    }
    for(var i=0; i<buttontexts.length ; i++){
      buttons.push({
        text: buttontexts[i],
        role: 'cancel',
        handler: createCallback(i)
      });
    }
    let alert = this.alertCtrl.create({
      title: 'Rent a Truck',
      message: message,
      buttons: buttons
    });
    alert.present();
  }

}
