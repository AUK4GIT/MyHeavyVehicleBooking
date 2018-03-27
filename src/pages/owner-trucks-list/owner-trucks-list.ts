import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AppModelServiceProvider, AppTruck } from '../../providers/app-model-service/app-model-service'
import { OwnerAddTruckPage } from '../owner-add-truck/owner-add-truck';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-owner-trucks-list',
  templateUrl: 'owner-trucks-list.html',
})
export class OwnerTrucksListPage {
  items: AppTruck[];
  private loading: any;
  transObj: any;
  
  constructor(translate: TranslateService, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    translate.getTranslation(translate.currentLang).subscribe((value)=>{
      this.transObj = value;
    });
  }

  ionViewDidEnter() {
    this.presentLoadingCustom();
    this.appService.getTrucksForOwnerid(this.appService.currentUser.userid, (resp)=>{
      if(resp.result == "failure"){
        console.log("resp.error");
        this.presentAlert(resp.error, [this.transObj["OK"]], null);
      } else if (resp["data"]) {
        this.items = resp["data"];
      }
      this.dismissLoading();
    });        
    console.log('ionViewDidLoad OwnerTrucksListPage');
  }
getImage(truckid){
  var imgPath = "owner_"+this.appService.currentUser.userid+"/thumb_"+truckid+".jpeg";
  return "http://zamilrenttruck.com/images/trucks/"+imgPath;
}
  

  onModelChange(event) {

  }

  addTruck() {
    this.navCtrl.push(OwnerAddTruckPage);
  }

  deleteTruck(truck) {
    let self = this;
    this.presentAlert(this.transObj["WANTTODELETETRUCK"], [this.transObj["NO"],this.transObj["YES"]], (type) => {
      if (type == 0) {
        console.log("Delete Cancelled");
      } else {
        console.log("Delete executed");
        self.appService.deleteTruck(truck, (data) => {
          if (data.result == 'success') {
            const index: number = self.items.indexOf(truck);
            self.items.splice(index, 1);
          } else {
            self.presentAlert(this.transObj["DELETEFAILEDTRYAGAIN"], [this.transObj["OK"]], null);
          }
        });
      }
    })
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
