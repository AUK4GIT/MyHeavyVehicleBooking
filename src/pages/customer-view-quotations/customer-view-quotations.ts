import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AppModelServiceProvider, AppQuotation, AppTrip } from '../../providers/app-model-service/app-model-service';
import { CustomerQuotationsDetailsPage } from '../customer-quotations-details/customer-quotations-details'
@Component({
  selector: 'page-customer-view-quotations',
  templateUrl: 'customer-view-quotations.html',
})
export class CustomerViewQuotationsPage {
  private loading: any;
  quotations: AppQuotation[];
  trip: AppTrip;
  constructor(public alertCtrl :AlertController, private loadingCtrl: LoadingController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  this.trip = this.navParams.get("trip");
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad CustomerViewQuotationsPage');
    this.presentLoadingCustom();
    this.appService.getQuotationsForTripId(this.trip.tripid, (resp) => {
      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, ["OK"], null);
      } else if (resp["data"]) {
        this.quotations = resp["data"];
      }
    });
  }

  navigateToQuotationDetails(quotation) {
    this.navCtrl.push(CustomerQuotationsDetailsPage, {
      quotation: quotation,
      trip: this.trip
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
