import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController  } from 'ionic-angular';
import { AppModelServiceProvider, AppCity } from '../../providers/app-model-service/app-model-service'


@Component({
  selector: 'page-admin-update-vat',
  templateUrl: 'admin-update-vat.html',
})
export class AdminUpdateVatPage {

  vat: string;
  private loading: any;
  constructor(private alertCtrl: AlertController, public loadingCtrl: LoadingController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminUpdateVatPage');
    this.getVAT();
  }

  getVAT(){
      this.presentLoadingCustom();
      this.appService.getAppConstants((resp)=>{
        this.dismissLoading();
        if(resp.result == "failure"){
          console.log("resp.error");
          this.presentAlert(resp.error,["OK"],null);
        } else if (resp["data"]) {
          let dict = resp["data"][0];
          this.vat = dict["vat"];
        }
      });
  }


  updateVAT(){
    if(this.vat && this.vat != "") {
      this.presentLoadingCustom();
      this.appService.updateVAT({vat : this.vat}, (resp)=>{
        this.dismissLoading();
        if(resp.result == "failure"){
          console.log("resp.error");
          this.presentAlert(resp.error,["OK"],null);
        } else {
          this.presentAlert(resp.message,["OK"],()=>{
            // this.navCtrl.pop();
          });
        }
      });
    } else {
      this.presentAlert("Please fil all the details.",["OK"],null);
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
        text: "NO",
        role: 'cancel',
        handler: () => {
          // this.navCtrl.pop();
        }
      }
    ];
    if(callback){
      buttons.push({
        text: "YES",
        role: 'cancel',
        handler: callback
      });
    }
    let alert = this.alertCtrl.create({
      title: 'Rent a Truck',
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

}
