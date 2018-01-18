import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AppModelServiceProvider, AppTrip } from '../../providers/app-model-service/app-model-service';
import { CustomerTripeRatingPage } from '../customer-tripe-rating/customer-tripe-rating'

@Component({
  selector: 'page-customer-bookings-list',
  templateUrl: 'customer-bookings-list.html',
})
export class CustomerBookingsListPage {
  items: AppTrip[];
  private loading: any;
  constructor(private loadingCtrl: LoadingController, private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.presentLoadingCustom();
    this.appService.getRequestedTripsForUserId(this.appService.currentUser.userid, (resp) => {

      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, ["OK"], null);
      } else if (resp["data"]) {
        this.items = resp["data"];
      }
    });        
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

  presentLoadingCustom() {
    if(!this.loading) {
      this.loading = this.loadingCtrl.create({
        duration: 10000
      });
    
      this.loading.onDidDismiss(() => {
        console.log('Dismissed loading');
      });
    
      this.loading.present();
    }
  }
  
  dismissLoading(){
    if(this.loading){
        this.loading.dismiss();
        this.loading = null;
    }
}
}
