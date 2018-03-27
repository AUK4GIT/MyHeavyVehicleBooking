import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AppModelServiceProvider, AppTrip, AppQuotation, AppTruck, AppUser } from '../../providers/app-model-service/app-model-service'
import { TranslateService } from '@ngx-translate/core';

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
  transObj: any;

  constructor(translate: TranslateService, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.trip = this.navParams.get('trip');
    translate.getTranslation(translate.currentLang).subscribe((value)=>{
      this.transObj = value;
    });
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad DriverTripDetailsPage');
    this.presentLoadingCustom();
     this.appService.getConfirmedQuotationForTripId(this.trip.tripid, (resp)=>{   
       this.dismissLoading();
       if (resp.result == "failure") {
         console.log("resp.error");
         this.presentAlert(resp.error, [this.transObj["OK"]], null);
       } else if (resp["data"]) {
         if(resp["data"].length > 0){
          this.quotation = resp["data"][0];
          this.comments = this.quotation.comments;
          this.charges = this.quotation.additionalcharges;
          this.getTruckForTruckId(this.quotation.truckid);
         }
       }
     });
     this.appService.getUserById(this.trip.userid, (resp)=>{
      this.dismissLoading();
      if(resp.result == "failure"){
        console.log("resp.error");
        this.presentAlert(resp.error, [this.transObj["OK"]], null);
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
        this.presentAlert(resp.error, [this.transObj["OK"]], null);
      } else if (resp["data"]) {
        if(resp["data"].length > 0){
          this.truckdetails = resp["data"][0];
        }
      }
    });
  }

  onAdditionalChargesEntered() {
    
  }
  
  getTotalAmount(trip?: any, quotation?: any, offer?: any) {
    var total = 0;
    total = total + Number(quotation.cost);
    if(trip.offerdiscount && trip.offerdiscount!="" && trip.offerdiscount!=undefined && trip.offerdiscount!=null){
      total = total - (quotation.cost * trip.offerdiscount / 100);
    }
    if (quotation.additionalcharges != "" && quotation.additionalcharges != null && quotation.additionalcharges != undefined && Number(quotation.additionalcharges) != NaN) {
      total = total + Number(quotation.additionalcharges);
    }
    total = total + (trip.vat * total / 100);
    return total;
  }

  completeTrip(){
    this.quotation.comments = this.comments;
    this.quotation.additionalcharges = this.charges;
    this.presentLoadingCustom();
    this.appService.completeTripWithId(this.trip.tripid, this.quotation.quotationid, this.quotation.comments, this.quotation.additionalcharges, (resp)=>{
      this.dismissLoading();
      if(resp.result == "failure"){
        console.log("resp.error");
        this.presentAlert(resp.error, [this.transObj["OK"]], null);
      } else if (resp["message"]) {
        this.presentConfirm();
      }
    });
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: this.transObj["RENTATRUCK"],
      message: this.transObj["TRIPCOMPLETED"],
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
