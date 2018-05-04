import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AppModelServiceProvider, AppTrip } from '../../providers/app-model-service/app-model-service';
import { CustomerTripeRatingPage } from '../customer-tripe-rating/customer-tripe-rating'
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-customer-bookings-list',
  templateUrl: 'customer-bookings-list.html',
})
export class CustomerBookingsListPage {
  items: AppTrip[];
  private loading: any;
  transObj: any;

  order: number=1;
  column: string = 'startdate';
  arrow: string = 'down';

  constructor(translate: TranslateService, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    translate.getTranslation(translate.currentLang).subscribe((value)=>{
      this.transObj = value;
    });
  }

  ionViewDidLoad() {
    this.presentLoadingCustom();
    this.appService.getRequestedTripsForUserId(this.appService.currentUser.userid, (resp) => {

      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, [this.transObj["OK"]], null);
      } else if (resp["data"]) {
        // this.items = resp["data"];
        this.items = resp["data"].map((value) => {
          value.startdate = value.startdate.replace(/\s/g, "T");
          value.duration = Number(value.duration);
          value.cost = Number(value.cost);
          return value;
        });
      }
    });        
    console.log('ionViewDidLoad CustomerBookingsListPage');
  }

  changeSort(ele) {
    if(this.column === ele){
      this.arrow = this.arrow=='up' ? 'down' : 'up';
      this.order = this.order==-1  ? 1: -1;
    }else{
      this.order = 1;
      this.arrow = 'down';
    }
    this.column = ele;    
  }

  reviewandRate(trip){
    if(trip.status == "completed"){
      this.navCtrl.push(CustomerTripeRatingPage,{trip: trip});
    } else {
      this.presentAlert(this.transObj["TRIPAVAILABLEAFTERCOMPLETE"],[this.transObj["OK"]],null);
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
