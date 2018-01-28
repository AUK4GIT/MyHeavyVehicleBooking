import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AppModelServiceProvider, AppQuotation, AppUser, AppTrip } from '../../providers/app-model-service/app-model-service';

@Component({
  selector: 'page-customer-quotations-details',
  templateUrl: 'customer-quotations-details.html',
})
export class CustomerQuotationsDetailsPage {

  quotation: AppQuotation;
  trip: AppTrip;
  owner: AppUser;
  driver: AppUser;
  private loading: any;
  constructor(private loadingCtrl: LoadingController, private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  this.quotation = this.navParams.get("quotation");
  this.trip = this.navParams.get("trip");  
  }

  ionViewDidEnter() {
    this.presentLoadingCustom();
    console.log('ionViewDidLoad CustomerQuotationsDetailsPage');
    // this.owner = this.appService.getUserById(this.quotation.ownerid);
    // this.driver = this.appService.getUserById(this.quotation.driver);
    this.appService.getUserById(this.quotation.ownerid, (resp)=>{
      this.dismissLoading();
      if(resp.result == "failure"){
        console.log("resp.error");
        this.presentAlert(resp.error, ["OK"], null);
      } else if (resp["data"]) {
        if(resp["data"].length>0){
          this.owner = resp["data"][0];
        }
      }
    });
    if (this.quotation.driver != "") {
      this.appService.getUserById(this.quotation.driver, (resp) => {
        this.dismissLoading();
        if (resp.result == "failure") {
          console.log("resp.error");
          this.presentAlert(resp.error, ["OK"], null);
        } else if (resp["data"]) {
          if (resp["data"].length > 0) {
            this.driver = resp["data"][0];
          }
        }
      });
    }
  }

  confirmQuote(){
    if(this.trip.status == 'requested'){
      this.presentAlert("You can book this trip once the owner accepts and the status is changed to confirmed.",["OK"],null);
      return;
    } 
    this.presentLoadingCustom();
    this.appService.confirmQuotation(this.quotation.quotationid, this.quotation.cost, this.quotation.duration, this.quotation.tripid, this.quotation.ownername, (resp)=>{
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
      message: 'ThankYou for choosing a quotation. You can contact the truck provider for proceedings.',
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
