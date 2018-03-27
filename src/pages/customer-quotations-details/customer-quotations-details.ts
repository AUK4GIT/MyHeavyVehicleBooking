import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AppModelServiceProvider, AppQuotation, AppUser, AppTrip, AppTruck } from '../../providers/app-model-service/app-model-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-customer-quotations-details',
  templateUrl: 'customer-quotations-details.html',
})
export class CustomerQuotationsDetailsPage {

  quotation: AppQuotation;
  trip: AppTrip;
  owner: AppUser;
  driver: AppUser;
  truck: AppTruck;
  private loading: any;
  transObj: any;
  constructor(translate: TranslateService, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  this.quotation = this.navParams.get("quotation");
  this.trip = this.navParams.get("trip");  
  translate.getTranslation(translate.currentLang).subscribe((value)=>{
    this.transObj = value;
  });
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
        this.presentAlert(resp.error, [this.transObj["OK"]], null);
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
          this.presentAlert(resp.error, [this.transObj["OK"]], null);
        } else if (resp["data"]) {
          if (resp["data"].length > 0) {
            this.driver = resp["data"][0];
          }
        }
      });
    }
    this.getTruckDetails(this.quotation.truckid);
  }

  getTruckDetails(truckid){
    this.appService.getTruckForTruckId(truckid, (resp) => {
      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, [this.transObj["OK"]], null);
      } else if (resp["data"]) {
        if(resp["data"].length > 0){
          this.truck = resp["data"][0];
        }
      }
    });
  }

  confirmQuote(){
    if(this.trip.status == 'requested'){
      this.presentAlert(this.transObj["BOOKAFTERACCEPTANCE"],[this.transObj["OK"]],null);
      return;
    } 
    this.presentLoadingCustom();
    this.appService.confirmQuotation(this.quotation.quotationid, this.quotation.cost, this.quotation.duration, this.quotation.tripid, this.quotation.ownername, this.quotation.ownerid, (resp)=>{
      this.dismissLoading();
      if(resp.result == "failure"){
        console.log("resp.error");
        this.presentAlert(resp.error, [this.transObj["OK"]], null);
      } else if (resp["message"]) {
        this.presentConfirm();
      }
    });
  }

  getTotalAmount(trip?: any, quotation?: any, offer?: any) {
    var total = 0;
    total = total + Number(quotation.cost);
    if(trip && trip.offerdiscount && trip.offerdiscount!="" && trip.offerdiscount!=undefined && trip.offerdiscount!=null){
      total = total - (quotation.cost * trip.offerdiscount / 100);
    }
    if (quotation.additionalcharges != "" && quotation.additionalcharges != null && quotation.additionalcharges != undefined && Number(quotation.additionalcharges) != NaN) {
      total = total + Number(quotation.additionalcharges);
    }
    total = total + (trip.vat * total / 100);
    return total;
  }
  
  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: this.transObj["RENTATRUCK"],
      message: this.transObj["THANKCHOOSEQUOTE"],
      buttons: [
        {
          text: this.transObj["OK"],
          role: this.transObj["CANCEL"],
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
        role: this.transObj["CANCEL"],
        handler: createCallback(i)
      });
    }
    let alert = this.alertCtrl.create({
      title: this.transObj["RENTATRUCK"],
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
