import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController  } from 'ionic-angular';
import { AppModelServiceProvider, AppCity } from '../../providers/app-model-service/app-model-service'
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-add-truck-type',
  templateUrl: 'add-truck-type.html',
})
export class AddTruckTypePage {

  trucktype: string;
  description: string;
  private loading: any;
  transObj: any;
  constructor(private alertCtrl: AlertController, public loadingCtrl: LoadingController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams, translate: TranslateService) {
    translate.getTranslation(translate.currentLang).subscribe((value)=>{
      this.transObj = value;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddTruckTypePage');
  }

  addTruckType() {
    if(this.trucktype && this.description && true) {
    this.presentLoadingCustom();
    this.appService.createTruckType({type:this.trucktype, truckdescription: this.description}, (resp)=>{
      this.dismissLoading();
      if(resp.result == "failure"){
        console.log("resp.error");
        this.presentAlert(resp.error,[this.transObj["OK"]],null);
      } else {
        this.presentAlert(resp.message,[this.transObj["OK"]],()=>{
          this.navCtrl.pop();
        });
      }
    });
  } else {
    this.presentAlert(this.transObj["FILLALLDETAILS"],[this.transObj["OK"]],null);
  }
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

  presentConfirm(message, callback) {
    var buttons = [
      {
        text: this.transObj["NO"],
        role: this.transObj["CANCEL"],
        handler: () => {
          // this.navCtrl.pop();
        }
      }
    ];
    if(callback){
      buttons.push({
        text:this.transObj["YES"],
        role: this.transObj["CANCEL"],
        handler: callback
      });
    }
    let alert = this.alertCtrl.create({
      title: this.transObj["RENTATRUCK"],
      message: message,
      buttons: buttons
    });
    alert.present();
  }
  
  dismissLoading(){
    if(this.loading){
        this.loading.dismiss();
        this.loading = null;
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

}
