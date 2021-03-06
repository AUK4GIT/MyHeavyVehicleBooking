import { Component } from '@angular/core';
import { AlertController, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AppModelServiceProvider, AppUser } from '../../providers/app-model-service/app-model-service'
import { OwnerAddDriverPage } from '../owner-add-driver/owner-add-driver';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-drivers-list',
  templateUrl: 'drivers-list.html',
})
export class DriversListPage {
  items: [AppUser];
  private loading: any;
  transObj: any;

  constructor(translate: TranslateService, private alertCtrl :AlertController, private loadingCtrl: LoadingController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    translate.getTranslation(translate.currentLang).subscribe((value)=>{
      this.transObj = value;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DriversListPage');
  }

  ionViewDidEnter() {
    // this.items = this.appService.getUsersByRole("driver");                
    // this.items = this.appService.getDriversForOwner(this.appService.currentUser.userid);  
   this.presentLoadingCustom();
    this.appService.getDriversForOwner(this.appService.currentUser.userid, (resp) => {
      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, [this.transObj["OK"]], null);
      } else if (resp["data"]) {
        this.items = resp["data"];
      }
    });              
  }

  addDriver(){
    this.navCtrl.push(OwnerAddDriverPage);
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
