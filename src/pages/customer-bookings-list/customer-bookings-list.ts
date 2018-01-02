import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AppModelServiceProvider, AppTrip } from '../../providers/app-model-service/app-model-service';
import { CustomerTripeRatingPage } from '../customer-tripe-rating/customer-tripe-rating'

@Component({
  selector: 'page-customer-bookings-list',
  templateUrl: 'customer-bookings-list.html',
})
export class CustomerBookingsListPage {
  items: AppTrip[];
  constructor(private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.items = this.appService.getRequestedTripsForUserId(this.appService.currentUser.userid);        
    console.log('ionViewDidLoad CustomerBookingsListPage');
  }

  reviewandRate(trip){
    if(trip.status == "completed"){
      this.navCtrl.push(CustomerTripeRatingPage,{trip: trip});
    } else {
      this.presentAlert("The trip will be available to you for review and rating once the driver marks it complete.",["OK"],null);
    }
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
