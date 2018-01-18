import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AppModelServiceProvider, AppTrip, AppQuotation } from '../../providers/app-model-service/app-model-service'
import { DriverTripDetailsPage } from '../driver-trip-details/driver-trip-details'

@Component({
  selector: 'page-driver-trips-list',
  templateUrl: 'driver-trips-list.html',
})
export class DriverTripsListPage {
  items: AppQuotation[];
  private loading: any;
  constructor(public alertCtrl :AlertController, private loadingCtrl: LoadingController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.presentLoadingCustom();
    console.log('ionViewDidLoad DriverTripsListPage');
    this.appService.getConfirmedTripsforDriverId(this.appService.currentUser.userid, (resp)=>{
      this.dismissLoading();
      if(resp.result == "failure"){
        console.log("resp.error");
        this.presentAlert(resp.error, ["OK"], null);
      } else if (resp["data"]) {
        this.items = resp["data"];
      }
    });        
  }

  showTripDetails(trip){
    this.navCtrl.push(DriverTripDetailsPage, {
      trip: trip
    });
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
