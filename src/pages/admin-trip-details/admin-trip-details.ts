
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AppModelServiceProvider, AppQuotation, AppUser, AppTrip } from '../../providers/app-model-service/app-model-service';

@Component({
  selector: 'page-admin-trip-details',
  templateUrl: 'admin-trip-details.html',
})
export class AdminTripDetailsPage {


  quotation: AppQuotation;
  trip: AppTrip;
  owner: AppUser;
  driver: AppUser;
  customer: AppUser;
  private loading: any;

  constructor(private loadingCtrl: LoadingController, private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.trip = this.navParams.get("trip");
  }

  getTotalAmount(trip?: any, quotation?: any, offer?: any) {
    var total = 0;
    total = total + Number(quotation.cost) + (trip.vat * quotation.cost / 100);
    if (offer && offer.discount && offer.discount != "" && offer.discount != undefined && offer.discount != null) {
      total = total - (quotation.cost * offer.discount / 100);
    }
    return total;
  }

  ionViewDidEnter() {
    this.presentLoadingCustom();

    this.appService.getUserById(this.trip.ownerid, (resp) => {
      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, ["OK"], null);
      } else if (resp["data"]) {
        if (resp["data"].length > 0) {
          this.owner = resp["data"][0];
        }
      }
    });

    this.appService.getConfirmedQuotationForTripId(this.trip.tripid, (resp) => {
      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, ["OK"], null);
      } else if (resp["data"]) {
        if (resp["data"].length > 0) {
          this.quotation = resp["data"][0];

          if (this.quotation.driver != "") {
            this.appService.getUserById(this.quotation.driver, (resp) => {
              this.dismissLoading();
              if (resp.result == "failure") {
                console.log("resp.error");
                this.presentAlert(resp.error, ["OK"], null);
              } else if (resp["data"]) {
                if (resp["data"].length > 0) {
                  this.driver = resp["data"][0];
                }
              }
            });
          }
        }
      }
    });
    this.appService.getUserById(this.trip.userid, (resp) => {
      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, ["OK"], null);
      } else if (resp["data"]) {
        if (resp["data"].length > 0) {
          this.customer = resp["data"][0];
        }
      }
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
    var createCallback = (i) => {
      return () => {
        if (callback) {
          callback(i);
        }
      }
    }
    for (var i = 0; i < buttontexts.length; i++) {
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
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        duration: 10000
      });

      this.loading.onDidDismiss(() => {
        console.log('Dismissed loading');
      });

      this.loading.present();
    }
  }

  dismissLoading() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }

}