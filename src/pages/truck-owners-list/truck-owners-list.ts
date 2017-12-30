import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AppModelServiceProvider, AppUser } from '../../providers/app-model-service/app-model-service';

@Component({
  selector: 'page-truck-owners-list',
  templateUrl: 'truck-owners-list.html',
})
export class TruckOwnersListPage {
  userGroups: any[]; 
  constructor(private alertCtrl: AlertController, public appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidEnter() {
    this.groupItems();
  }

  groupItems() {
    var users = this.appService.getUsersByRole("owner");  
    this.userGroups = this.appService.groupByreturningArray(users, "status", false);
  }

  deleteItem(item, gindex, iindex) {
    this.presentConfirm('Do you want to delete this item ?.', () => {
      this.appService.deleteuser(item, (response) => {
        if(response.result == "success"){
          let group = this.userGroups[gindex].list;
          group.splice(iindex,1);
        } else {
          this.presentConfirm('Error deleting item', null);
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
        this.presentConfirm('Error updating item', null);
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
