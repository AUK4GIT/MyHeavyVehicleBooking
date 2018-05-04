import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AppModelServiceProvider, AppQuotation, AppTrip } from '../../providers/app-model-service/app-model-service';
import { CustomerQuotationsDetailsPage } from '../customer-quotations-details/customer-quotations-details'
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-customer-view-quotations',
  templateUrl: 'customer-view-quotations.html'
})
export class CustomerViewQuotationsPage {
  private loading: any;
  quotations: AppQuotation[];
  trip: AppTrip;
  transObj: any;
  notnull: any;
  descending: boolean = false;
  order: number;
  column: string = 'cost';
  arrow: string = 'down';

  constructor(translate: TranslateService, public alertCtrl :AlertController, private loadingCtrl: LoadingController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  this.trip = this.navParams.get("trip");
  translate.getTranslation(translate.currentLang).subscribe((value)=>{
    this.transObj = value;

  });
   this.column = 'cost';
   this.order = -1;
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad CustomerViewQuotationsPage');
    this.presentLoadingCustom();
    this.appService.getQuotationsForTripId(this.trip.tripid, (resp) => {
      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, [this.transObj["OK"]], null);
      } else if (resp["data"]) {
        resp.data = resp.data.filter(quote => quote.status != '');
        resp.data = resp.data.map(obj => {
          obj.cost = Number(obj.cost);
          obj.duration = Number(obj.duration);
          return obj;
        });
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

  changeSort(ele) {
    console.log('came to here',ele);
    if(this.column === ele){
      this.arrow = this.arrow=='up' ? 'down' : 'up';
      this.order = this.order==-1  ? 1: -1;
    }else{
      this.order = 1;
      this.arrow = 'down';
    }
    this.column = ele;
    console.log("column:",this.column);
    
  }

  dismissLoading(){
    if(this.loading){
        this.loading.dismiss();
        this.loading = null;
    }
}

}
