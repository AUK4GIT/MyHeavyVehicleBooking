import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AppModelServiceProvider, AppTruck } from '../../providers/app-model-service/app-model-service'
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-trucks-list',
  templateUrl: 'trucks-list.html',
})
export class TrucksListPage {
  truckGroups: any[];
  trucks: any[];
  private loading: any;
  transObj: any;

  constructor(translate: TranslateService, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    translate.getTranslation(translate.currentLang).subscribe((value)=>{
      this.transObj = value;
    });
  }

  ionViewDidEnter() {
    this.presentLoadingCustom();
    this.appService.getTrucks((resp)=>{
      if(resp.result == "failure"){
        console.log("resp.error");
        this.presentAlert(resp.error, [this.transObj["OK"]], null);
      } else if (resp["data"]) {
        this.trucks = resp["data"];
        this.groupItems();
      }
      this.dismissLoading();
    })
    
    }

    getImage(truck){
      var imgPath = "owner_"+truck.ownerid+"/thumb_"+truck.truckid+".jpeg";
      return "http://zamilrenttruck.com/images/trucks/"+imgPath;
    }
    
  groupItems() {
    this.truckGroups = this.appService.groupByreturningArray(this.trucks, "status", false);
  }

  deleteItem(item, gindex, iindex) {
    this.presentConfirm(this.transObj["DOYOUDELETE"], () => {
      this.appService.deleteTruck(item, (response) => {
        if(response.result == "success"){
          let group = this.truckGroups[gindex].list;
          group.splice(iindex,1);
        } else {
          this.presentConfirm(this.transObj["ERRORDELETING"], null);
        }
      })
    });
  }
  approveItem(item, gindex, iindex) {
    this.appService.approveTruck(item, (response) => {
      if(response.result == "success"){
        let group = this.truckGroups[gindex].list;
        let truck = group[iindex];    
        truck.status = "approved";
        this.groupItems();
      } else {
        this.presentConfirm(this.transObj["ERRORUPDATING"], null);
      }
    })
  }
  blockItem(item, gindex, iindex) {
    this.appService.blockTruck(item, (response) => {
      if(response.result == "success"){
        let group = this.truckGroups[gindex].list;
        let truck = group[iindex];    
        truck.status = "blocked";
        this.groupItems();
      } else {
        this.presentConfirm(this.transObj["ERRORUPDATING"], null);
      }
    })
    
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
