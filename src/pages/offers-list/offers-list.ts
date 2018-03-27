import { Component } from '@angular/core';
import { NavController, NavParams , LoadingController, AlertController} from 'ionic-angular';
import { AppModelServiceProvider, AppOffer } from '../../providers/app-model-service/app-model-service'
import { OwnerAddEditOfferPage } from '../owner-add-edit-offer/owner-add-edit-offer'
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-offers-list',
  templateUrl: 'offers-list.html',
})
export class OffersListPage {
  items: AppOffer[];
  private loading: any;
  transObj: any;
  
  constructor(translate: TranslateService, private alertCtrl: AlertController, public loadingCtrl: LoadingController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    translate.getTranslation(translate.currentLang).subscribe((value)=>{
      this.transObj = value;
    });
  }

  ionViewDidEnter() {
    this.presentLoadingCustom();
    this.appService.getOffersByOwnerId(this.appService.currentUser.userid,(resp)=>{
      if(resp.result == "failure"){
        console.log("resp.error");
      } else {
        this.items = resp.data;
      }
      this.dismissLoading();
    });            
    console.log('ionViewDidLoad OffersListPage');
  }

  createOffer() {
    this.navCtrl.push(OwnerAddEditOfferPage);
  }

  deleteItem(offer, iindex) {
    this.presentConfirm(this.transObj["DOYOUDELETE"], () => {
      this.appService.deleteoffer(offer, (response) => {
        if(response.result == "success"){
          this.items.splice(iindex,1);
        } else {
          this.presentConfirm(this.transObj["ERRORDELETING"], null);
        }
      })
    });
  }

  editOffer(offer) {
    this.navCtrl.push(OwnerAddEditOfferPage, {
      offer: offer
    });
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
