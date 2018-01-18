import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
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
  private loading: any;

  constructor(private loadingCtrl: LoadingController, private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.trip = this.navParams.get('trip');
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad DriverTripDetailsPage');
    this.presentLoadingCustom();
     this.appService.getConfirmedQuotationForTripId(this.trip.tripid, (resp)=>{   
       this.dismissLoading();
       if (resp.result == "failure") {
         console.log("resp.error");
         this.presentAlert(resp.error, ["OK"], null);
       } else if (resp["data"]) {
         if(resp["data"].length > 0){
          this.quotation = resp["data"][0];
          this.getTruckForTruckId(this.quotation.truckid);
         }
       }
     });
     this.appService.getUserById(this.trip.userid, (resp)=>{
      this.dismissLoading();
      if(resp.result == "failure"){
        console.log("resp.error");
        this.presentAlert(resp.error, ["OK"], null);
      } else if (resp["data"]) {
        if(resp["data"].length > 0){
         this.customer = resp["data"][0];
        }
      }
    });
  }

  getTruckForTruckId(truckid) {
    this.appService.getTruckForTruckId(truckid, (resp) => {
      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, ["OK"], null);
      } else if (resp["data"]) {
        if(resp["data"].length > 0){
          this.truckdetails = resp["data"][0];
        }
      }
    });
  }

  completeTrip(){
    this.quotation.comments = this.comments;
    this.quotation.additionalcharges = this.charges;
    this.presentLoadingCustom();
    this.appService.completeTripWithId(this.trip.tripid, this.quotation.quotationid, this.quotation.comments, this.quotation.additionalcharges, (resp)=>{
      this.dismissLoading();
      if(resp.result == "failure"){
        console.log("resp.error");
        this.presentAlert(resp.error, ["OK"], null);
      } else if (resp["message"]) {
        this.presentConfirm();
      }
    });
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
