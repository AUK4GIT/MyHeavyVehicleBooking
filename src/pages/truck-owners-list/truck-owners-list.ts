import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AppModelServiceProvider, AppUser } from '../../providers/app-model-service/app-model-service';
import { DatePipe } from '@angular/common';
import { DateToIsoPipe } from '../../pipes/date-to-iso/date-to-iso'
import { AdminOwnerTripsListPage } from '../admin-owner-trips-list/admin-owner-trips-list'

@Component({
  selector: 'page-truck-owners-list',
  templateUrl: 'truck-owners-list.html',
})
export class TruckOwnersListPage {
  userGroups: any[]; 
  users: any[];
  private loading: any;
  sortIsAscending: boolean;
  constructor(private loadingCtrl: LoadingController, private alertCtrl: AlertController, public appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.sortIsAscending = true;
  }

  ionViewDidEnter() {
    this.presentLoadingCustom();
    this.appService.getUsersByRole("owner",(resp)=>{
      this.dismissLoading();
      if(resp.result == "failure"){
        console.log("resp.error");
        this.presentAlert(resp.error, ["OK"], null);
      } else if (resp["data"]) {
        var usrs = resp["data"];
        // Split timestamp into [ Y, M, D, h, m, s ]
        usrs = usrs.map((value) => {
          var t = value.timestamp.split(/[- :]/);
          // Apply each element to the Date function
          var d = new Date(Date.UTC(t[0], t[1] - 1, t[2]));
          // value.timestamp = d.toISOString();
          value.timestamp = d;
          return value;
        });

        this.users = usrs;
        this.groupItems();
      }
    });
  }

  showTripsForUser(user) {
    this.navCtrl.push(AdminOwnerTripsListPage, {user: user});
  }

  sortData(){
    if(this.sortIsAscending == true){
      
      this.userGroups.forEach(function (group) {
        group.list.sort((a, b) =>
          a.timestamp-b.timestamp
        );
      });

    } else {
      
      this.userGroups.forEach(function (group) {
        group.list.sort((a, b) =>
          b.timestamp-a.timestamp
        );
      });

    }
    this.sortIsAscending = !this.sortIsAscending;
  }


  groupItems() {
    this.userGroups = this.appService.groupByreturningArray(this.users, "status", false);
    this.userGroups.forEach(function (group) {
      group.list.sort((a, b) =>
        b.timestamp-a.timestamp
      );
    });
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
 
