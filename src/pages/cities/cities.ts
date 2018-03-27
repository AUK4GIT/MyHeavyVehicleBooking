import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController  } from 'ionic-angular';
import { AppModelServiceProvider, AppCity } from '../../providers/app-model-service/app-model-service'
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-cities',
  templateUrl: 'cities.html',
})
export class CitiesPage {

  items: AppCity[];
  private loading: any;
  transObj: any;
  constructor(translate: TranslateService, private alertCtrl: AlertController, public loadingCtrl: LoadingController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    translate.getTranslation(translate.currentLang).subscribe((value)=>{
      this.transObj = value;
    });
  }


  ionViewDidEnter() {
            
    console.log('ionViewDidLoad OffersListPage');
    this.loadPlaces();
  }

  loadPlaces(){
    this.presentLoadingCustom();
    this.appService.getPlaces((resp) => {
      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, [this.transObj["OK"]], null);
      } else if (resp["data"]) {
        this.items = resp["data"];
      }
    });  
  }

  deleteItem(item, index) {
    this.presentConfirm(this.transObj["DOYOUDELETE"], () => {
      this.presentLoadingCustom();
      this.appService.deletePlace(item, (response) => {
        this.dismissLoading();
        if(response.result == "success"){
          this.items.splice(index,1);
        } else {
          this.presentConfirm(this.transObj["ERRORDELETING"], null);
        }
      })
    });
  }

  addNewPlace(){
    let prompt = this.alertCtrl.create({
      title: this.transObj["RENTATRUCK"],
      message: this.transObj["ADDNEWCITY"],
      inputs: [
        {
          name: this.transObj["CITY"],
          placeholder: this.transObj["ENTERNEWCITY"]
        },
      ],
      buttons: [
        {
          text: this.transObj["CANCEL"],
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: this.transObj["SEND"],
          handler: data => {
            console.log('Saved clicked: '+data.city);
            this.presentLoadingCustom();
            this.appService.createPlace({name:data.city}, (resp)=>{
              this.dismissLoading();
              if(resp.result == "failure"){
                console.log("resp.error");
                this.presentAlert(resp.error,[this.transObj["OK"]],null);
              } else {
                this.loadPlaces();
                this.presentAlert(resp.message,[this.transObj["OK"]],null);
              }
            });
          }
        }
      ]
    });
    prompt.present();
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
