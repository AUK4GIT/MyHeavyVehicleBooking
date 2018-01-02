import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AppModelServiceProvider, AppQuotation, AppUser, AppTrip } from '../../providers/app-model-service/app-model-service';

@Component({
  selector: 'page-customer-quotations-details',
  templateUrl: 'customer-quotations-details.html',
})
export class CustomerQuotationsDetailsPage {

  quotation: AppQuotation;
  trip: AppTrip;
  owner: AppUser;
  driver: AppUser;
  constructor( private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  this.quotation = this.navParams.get("quotation");
  this.trip = this.navParams.get("trip");  
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad CustomerQuotationsDetailsPage');
    this.owner = this.appService.getUserById(this.quotation.ownerid);
    this.driver = this.appService.getUserById(this.quotation.driver);
  }

  confirmQuote(){
    if(this.trip.status == 'requested'){
      this.presentAlert("You can book this trip once the owner accepts and the status is changed to confirmed.",["OK"],null);
      return;
    } 
    this.appService.confirmQuotation(this.quotation.quotationid, ()=>{
      this.presentConfirm();
    });
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Rent a Truck',
      message: 'ThankYou for choosing a quotation. You can contact the truck provider for proceedings.',
      buttons: [
        {
          text: "OK",
          role: 'cancel',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
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

}
