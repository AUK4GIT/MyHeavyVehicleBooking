import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AppModelServiceProvider, AppTruck } from '../../providers/app-model-service/app-model-service'
import { OwnerAddTruckPage } from '../owner-add-truck/owner-add-truck';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'page-owner-trucks-list',
  templateUrl: 'owner-trucks-list.html',
})
export class OwnerTrucksListPage {
  items: AppTruck[];
  private loading: any;
  constructor(private alertCtrl: AlertController, private loadingCtrl: LoadingController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidEnter() {
    this.presentLoadingCustom();
    this.appService.getTrucksForOwnerid(this.appService.currentUser.userid, (resp)=>{
      if(resp.result == "failure"){
        console.log("resp.error");
        this.presentAlert(resp.error, ["OK"], null);
      } else if (resp["data"]) {
        this.items = resp["data"];
      }
      this.dismissLoading();
    });        
    console.log('ionViewDidLoad OwnerTrucksListPage');
  }
getImage(truckid){
  return "http://zamilrenttruck.com/api.php/get/truck/imagebytruckid/"+truckid;
  // return "assets/imgs/logo_transparent.jpg";//"http://zamilrenttruck.com/api.php/get/truck/imagebytruckid/"+truckid;
}
  

  onModelChange(event) {

  }

  addTruck() {
    this.navCtrl.push(OwnerAddTruckPage);
  }

  deleteTruck(truck) {
    let self = this;
    this.presentAlert("Do you want to Delete the truck ?", ["No", "Yes"], (type) => {
      if (type == 0) {
        console.log("Delete Cancelled");
      } else {
        console.log("Delete executed");
        self.appService.deleteTruck(truck, (data) => {
          if (data.result == 'success') {
            const index: number = self.items.indexOf(truck);
            self.items.splice(index, 1);
          } else {
            self.presentAlert("Delete UnSuccessful! Try again", ["OK"], null);
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
