import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AppModelServiceProvider } from '../../providers/app-model-service/app-model-service'
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-owner-add-driver',
  templateUrl: 'owner-add-driver.html',
})
export class OwnerAddDriverPage {

  name: string;
  phonenumber: string;
  password: string;
  email: string;
  nationalid: string;
  license: string;
  private loading: any;
  OK: string;
  APPTITLE: string;
  ADDDRIVERMESSAGE: string;

  constructor(private loadingCtrl: LoadingController, private translate: TranslateService, private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.translate.get('OK').subscribe(
      value => {
        this.OK = value;
      }
    )
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OwnerAddDriverPage');
  }

  addDriver() {
    if(this.name && this.password && this.email && this.phonenumber && this.license && this.nationalid && true){
      this.presentLoadingCustom();
      this.appService.addUser({
        name: this.name,
        email: this.email,
        password: this.password,
        phonenumber: this.phonenumber,
        role: "driver",
        status: "pending",
        ownerid: this.appService.currentUser.userid
      }, (resp)=>{
        if(resp.result == "failure"){
          console.log("resp.error");
          this.presentAlert(resp.error, ["OK"], null);
        } else if (resp["message"]) {
          // this.presentAlert(resp.message, ["OK"], null);
          this.presentConfirm();
        }
        this.dismissLoading();
      });
    }
  }

  focusFunction() {
    // console.log("onFocus");
    // this.serverError = "";
  }


  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Rent a Truck',
      message: 'Driver added Successful. Pending approval from Admin.',
      buttons: [
        {
          text: this.OK,
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
