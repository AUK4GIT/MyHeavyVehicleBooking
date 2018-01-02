import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AppModelServiceProvider, AppOffer } from '../../providers/app-model-service/app-model-service'

@Component({
  selector: 'page-admin-offers-list',
  templateUrl: 'admin-offers-list.html',
})
export class AdminOffersListPage {

  offerGroups: any[];
  constructor(private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidEnter() {
    this.groupItems();
    console.log('ionViewDidLoad AdminOffersListPage');
  }

  groupItems() {
    var offers = this.appService.getOffers();  
    this.offerGroups = this.appService.groupByreturningArray(offers, "status", false);
  }

  deleteItem(item, gindex, iindex) {
    this.presentConfirm('Do you want to delete this item ?.', () => {
      this.appService.deleteoffer(item, (response) => {
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
    this.appService.approveoffer(item, (response) => {
      if(response.result == "success"){
        let group = this.offerGroups[gindex].list;
        let item = group[iindex];    
        item.status = "approved";
        this.groupItems();
      } else {
        this.presentConfirm('Error updating item', null);
      }
    })
  }
  rejectItem(item, gindex, iindex) {
    this.appService.rejectoffer(item, (response) => {
      if(response.result == "success"){
        let group = this.offerGroups[gindex].list;
        let item = group[iindex];    
        item.status = "rejected";
        this.groupItems();
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

}
