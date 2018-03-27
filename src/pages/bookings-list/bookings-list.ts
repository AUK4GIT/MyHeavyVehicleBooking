import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AppModelServiceProvider, AppTrip } from '../../providers/app-model-service/app-model-service'
import { OwnerTripQuotationPage } from '../owner-trip-quotation/owner-trip-quotation';
import { OwnerCreateTripPage } from '../owner-create-trip/owner-create-trip'
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the BookingsListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-bookings-list',
  templateUrl: 'bookings-list.html',
})
export class BookingsListPage {
  items: AppTrip[];
  private loading: any;
  transObj: any;
  constructor(translate: TranslateService, public alertCtrl :AlertController, private loadingCtrl: LoadingController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    translate.getTranslation(translate.currentLang).subscribe((value)=>{
      this.transObj = value;
    });
  }

  ionViewDidEnter() {
    this.presentLoadingCustom();
    this.appService.getRequestedTripsForOwnerid(this.appService.currentUser.userid, (resp)=>{
      this.dismissLoading();
  if(resp.result == "failure"){
    console.log("resp.error");
    this.presentAlert(resp.error, [this.transObj["OK"]], null);
  } else if (resp["data"]) {
    // this.items = resp["data"];
    this.items = resp["data"].map((value) => {
      value.startdate = value.startdate.replace(/\s/g, "T");
      return value;
    });
  }
    });            
    console.log('ionViewDidLoad OwnerTripsListPage');
  }

  giveQuotationsForTrip(trip) {
    this.navCtrl.push(OwnerTripQuotationPage, { tripid: trip.tripid, trucktype: trip.trucktype, status: trip.status});    
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
