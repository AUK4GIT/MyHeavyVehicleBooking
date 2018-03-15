import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AppModelServiceProvider, AppOffer } from '../../providers/app-model-service/app-model-service'
import { LoadingCmp } from 'ionic-angular/components/loading/loading-component';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

@Component({
  selector: 'page-admin-offers-list',
  templateUrl: 'admin-offers-list.html',
})
export class AdminOffersListPage {

  offerGroups: any[];
  offers: any[];
  loading: any;
  constructor(private loadingCtrl: LoadingController, private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidEnter() {
    this.presentLoadingCustom();
    this.appService.getAllOffers((resp)=>{
      this.dismissLoading();
      if(resp.result == "failure"){
        console.log("resp.error");
      } else {
        this.offers = resp.data;
        this.groupItems(this.offers);
      }
    });
    
    console.log('ionViewDidLoad AdminOffersListPage');
  }

  groupItems(offers) {
    this.offerGroups = this.appService.groupByreturningArray(offers, "status", false);
  }

  deleteItem(item, gindex, iindex) {
    this.presentConfirm('Do you want to delete this item ?.', () => {
      this.presentLoadingCustom();
      this.appService.deleteoffer(item, (response) => {
        this.dismissLoading();
        if(response.result == "success"){
          let group = this.offerGroups[gindex].list;
          group.splice(iindex,1);
        } else {
          this.presentConfirm('Error deleting item', null);
        }
      })
    });
  }
  approveItem(item, gindex, iindex) {
    this.presentLoadingCustom();
    this.appService.approveoffer(item, (response) => {
      this.dismissLoading();
      if(response.result == "success"){
        let group = this.offerGroups[gindex].list;
        let item = group[iindex];    
        item.status = "approved";
        this.groupItems(this.offers);
      } else {
        this.presentConfirm('Error updating item', null);
      }
    })
  }
  rejectItem(item, gindex, iindex) {
    this.presentLoadingCustom();
    this.appService.rejectoffer(item, (response) => {
      this.dismissLoading();
      if(response.result == "success"){
        let group = this.offerGroups[gindex].list;
        let item = group[iindex];    
        item.status = "rejected";
        this.groupItems(this.offers);
      } else {
        this.presentConfirm('Error updating item', null);
      }
    })
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
