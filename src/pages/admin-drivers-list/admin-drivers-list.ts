import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController,  AlertController} from 'ionic-angular';
import { AppModelServiceProvider, AppUser } from '../../providers/app-model-service/app-model-service'
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-admin-drivers-list',
  templateUrl: 'admin-drivers-list.html',
})
export class AdminDriversListPage {

  userGroups: any[];
  users: any[];
  private loading: any;
  transObj: any;
  constructor(translate: TranslateService, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    translate.getTranslation(translate.currentLang).subscribe((value)=>{
      this.transObj = value;
    });
  }

  ionViewDidEnter() {
    this.presentLoadingCustom();
    this.appService.getAllDrivers((resp)=>{
      this.dismissLoading();
      if(resp.result == "failure"){
        console.log("resp.error");
        this.presentAlert(resp.error, [this.transObj["OK"]], null);
      } else if (resp["data"]) {
        this.users = resp["data"];
        this.groupItems();
      }
    })
    console.log('ionViewDidLoad CustomersListPage');
  }

  groupItems() {
    this.userGroups = this.appService.groupByreturningArray(this.users, "status", false);
  }

  deleteItem(item, gindex, iindex) {
    this.presentConfirm(this.transObj["DOYOUDELETE"], () => {
      this.appService.deleteuser(item, (response) => {
        if(response.result == "success"){
          let group = this.userGroups[gindex].list;
          group.splice(iindex,1);
        } else {
          this.presentConfirm(this.transObj["ERRORDELETING"], null);
        }
      })
    });
  }
  approveItem(item, gindex, iindex) {
    this.appService.approveuser(item, (response) => {
      if(response.result == "success"){
        let group = this.userGroups[gindex].list;
        let user = group[iindex];    
        user.status = "approved";
        this.groupItems();
      } else {
        this.presentConfirm(this.transObj["ERRORUPDATING"], null);
      }
    })
  }
  blockItem(item, gindex, iindex) {
    this.appService.blockuser(item, (response) => {
      if(response.result == "success"){
        let group = this.userGroups[gindex].list;
        let user = group[iindex];    
        user.status = "blocked";
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
