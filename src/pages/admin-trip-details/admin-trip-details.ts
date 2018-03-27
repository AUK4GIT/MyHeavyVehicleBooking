
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AppModelServiceProvider, AppQuotation, AppUser, AppTrip } from '../../providers/app-model-service/app-model-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-admin-trip-details',
  templateUrl: 'admin-trip-details.html',
})
export class AdminTripDetailsPage {


  quotation: any;
  trip: AppTrip;
  owner: AppUser;
  driver: AppUser;
  customer: AppUser;
  private loading: any;
  transObj: any;

  constructor(translate: TranslateService, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    let trip = this.navParams.get("trip");;
    trip.startdate = trip.startdate.replace(/\s/g, "T");
    this.trip = trip;
    translate.getTranslation(translate.currentLang).subscribe((value)=>{
      this.transObj = value;
    });
  }

  getTotalAmount(trip?: any, quotation?: any, offer?: any) {
    var total = 0;
    total = total + Number(trip.cost);
    if (offer && offer.discount && offer.discount != "" && offer.discount != undefined && offer.discount != null) {
      total = total - (trip.cost * offer.discount / 100);
    }
    if (quotation.additionalcharges != "" && quotation.additionalcharges != null && quotation.additionalcharges != undefined && Number(quotation.additionalcharges) != NaN) {
      total = total + Number(quotation.additionalcharges);
    }
    total = total + (trip.vat * total / 100);
    return total;
  }

  ionViewDidEnter() {
    this.presentLoadingCustom();
    let self = this;
    this.appService.getConfirmedQuotationForTripId(this.trip.tripid, (resp) => {
      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        self.presentAlert(resp.error, [this.transObj["OK"]], null);
      } else if (resp["data"]) {
        if (resp["data"].length > 0) {
          self.quotation = resp["data"][0];

          if (self.quotation.driver != "") {
            self.appService.getUserById(self.quotation.driver, (resp) => {
              self.dismissLoading();
              if (resp.result == "failure") {
                console.log("resp.error");
                self.presentAlert(resp.error, [this.transObj["OK"]], null);
              } else if (resp["data"]) {
                if (resp["data"].length > 0) {
                  self.driver = resp["data"][0];
                }
              }
            });
          }

          self.appService.getUserById(self.quotation.ownerid, (resp) => {
            self.dismissLoading();
            if (resp.result == "failure") {
              console.log("resp.error");
              self.presentAlert(resp.error, [this.transObj["OK"]], null);
            } else if (resp["data"]) {
              if (resp["data"].length > 0) {
                self.owner = resp["data"][0];
              }
            }
          });

        }
      }
    });
    this.appService.getUserById(this.trip.userid, (resp) => {
      self.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        self.presentAlert(resp.error, [this.transObj["OK"]], null);
      } else if (resp["data"]) {
        if (resp["data"].length > 0) {
          let cust = resp["data"][0];
          cust.timestamp = cust.timestamp.replace(/\s/g, "T");
          self.customer = cust;
        }
      }
    });

  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: this.transObj["RENTATRUCK"],
      message: this.transObj["THANKCHOOSEQUOTE"],
      buttons: [
        {
          text: this.transObj["OK"],
          role: this.transObj["CANCEL"],
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
        role: this.transObj["CANCEL"],
        handler: createCallback(i)
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
