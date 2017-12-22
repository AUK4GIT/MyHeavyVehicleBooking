import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AppModelServiceProvider, AppTruck } from '../../providers/app-model-service/app-model-service'

@Component({
  selector: 'page-trucks-list',
  templateUrl: 'trucks-list.html',
})
export class TrucksListPage {
  truckGroups: any[];
  constructor(private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidEnter() {
    this.groupItems();
    }

  groupItems() {
    var trucks = this.appService.getTrucks();  
    this.truckGroups = this.appService.groupByreturningArray(trucks, "status", false);
  }

  deleteItem(item, gindex, iindex) {
    this.presentConfirm('Do you want to delete this item ?.', () => {
      this.appService.deleteTruck(item, (response) => {
        if(response.result == "success"){
          let group = this.truckGroups[gindex].list;
          group.splice(iindex,1);
        } else {
          this.presentConfirm('Error deleting item', null);
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
        this.presentConfirm('Error updating item', null);
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
