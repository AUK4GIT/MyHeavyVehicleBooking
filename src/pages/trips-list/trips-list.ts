import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AppModelServiceProvider, AppTrip } from '../../providers/app-model-service/app-model-service'
import { AdminTripDetailsPage } from '../admin-trip-details/admin-trip-details'
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-trips-list',
  templateUrl: 'trips-list.html',
})
export class TripsListPage {
  items: AppTrip[];
  private loading: any;
  transObj: any;
  pendingitems: AppTrip[];
  confirmeditems: AppTrip[];
  segment: string;
  order: number=1;
  column: string = 'startdate';
  arrow: string = 'down';

  constructor(translate: TranslateService, public alertCtrl :AlertController, private loadingCtrl: LoadingController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    translate.getTranslation(translate.currentLang).subscribe((value)=>{
      this.transObj = value;
    });
    this.segment = 'pendingtrips';
  }

  ionViewDidEnter() {
    this.presentLoadingCustom();
    this.appService.getTrips((resp) => {
      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, [this.transObj["OK"]], null);
      } else if (resp["data"]) {
        // this.items = resp["data"];
        resp.data = resp["data"].map((value) => {
          value.startdate = value.startdate.replace(/\s/g, "T");
          return value;
        });
        this.pendingitems = resp['data'].filter(item => item.status === 'pending');
        this.confirmeditems = resp['data'].filter(item => item.status === 'confirmed');
        console.log(this.pendingitems);
        console.log(this.confirmeditems);
      }
    });           
  }

  showTripDetails(trip){
    this.navCtrl.push(AdminTripDetailsPage,{"trip":trip});
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

  segmentChanged(event) {

      this.column = 'startdate';
      this.arrow = 'down';

    
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
}
