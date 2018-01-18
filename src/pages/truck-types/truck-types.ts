import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AppModelServiceProvider, AppTruckType } from '../../providers/app-model-service/app-model-service'
import { AddTruckTypePage } from '../add-truck-type/add-truck-type'

@Component({
  selector: 'page-truck-types',
  templateUrl: 'truck-types.html',
})
export class TruckTypesPage {

  items: AppTruckType[];
  private loading: any;
  constructor(private alertCtrl: AlertController, public loadingCtrl: LoadingController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidEnter() {
    this.presentLoadingCustom();
    this.appService.getTruckTypes((resp) => {
      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, ["OK"], null);
      } else if (resp["data"]) {
        this.items = resp["data"];
      }
    });          
    console.log('ionViewDidLoad OffersListPage');
  }

  addNewTruckType() {
    this.navCtrl.push(AddTruckTypePage);
  }

  deleteItem(item, index) {
    this.presentConfirm('Do you want to delete this item ?.', () => {
      this.presentLoadingCustom();
      this.appService.deleteTruckType(item, (response) => {
        this.dismissLoading();
        if(response.result == "success"){
          this.items.splice(index,1);
        } else {
          this.presentConfirm('Error deleting item', null);
        }
      })
    });
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

}
