import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AppModelServiceProvider, AppQuotation, AppUser, AppTrip, AppOffer } from '../../providers/app-model-service/app-model-service';


@Component({
  selector: 'page-customer-book-predfined-trip',
  templateUrl: 'customer-book-predfined-trip.html',
})
export class CustomerBookPredfinedTripPage {

  quotation: AppQuotation;
  trip: AppTrip;
  owner: AppUser;
  // driver: AppUser;
  maxdate : string;
  mindate : string;
  private loading: any;
  offer: AppOffer;

  constructor(private loadingCtrl: LoadingController, private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.trip = this.navParams.get("trip"); 
    this.offer = this.navParams.get("offer"); 
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var c = new Date(year + 1, month, day)
    this.maxdate = c.getFullYear().toString();
    this.mindate = this.getMinDate(day, month, year);
  }
  private getMinDate(day: number, month: number, year: number): string {
    return year.toString() + "-" + (month.toString().length==1 ? "0"+month.toString() : month.toString()) + "-" + (day.toString().length==1 ? "0"+day.toString() : day.toString());
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerBookPredfinedTripPage');
    this.presentLoadingCustom();
    this.appService.getQuotationForId(this.trip.qidpdefinedtrip, (resp) => {
      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, ["OK"], null);
      } else if (resp["data"]) {
        this.quotation = resp["data"][0];
        this.getOwnerDetailsForQuotationId(this.quotation.ownerid);
      }
    });  
  }

  getOwnerDetailsForQuotationId(qid){
    this.presentLoadingCustom();
    this.appService.getUserById(qid, (resp)=>{
      this.dismissLoading();
      if(resp.result == "failure"){
        console.log("resp.error");
        this.presentAlert(resp.error, ["OK"], null);
      } else if (resp["data"]) {
        this.owner  = resp["data"][0];
      }
    });
  }

  bookTrip() {

    if(this.trip.startdate && this.trip.freight && true) {
      this.quotation.ownername = this.appService.currentUser.name;
      this.presentLoadingCustom();
      this.appService.createNewCompleteTripForPredefinedTripBooking(this.trip, this.quotation, this.appService.currentUser.userid, (resp)=>{
          this.loading.dismiss();
          if(resp.result == "failure"){
            console.log("resp.error");
            this.presentAlert(resp.error, ["OK"], null);
          } else if (resp["message"]) {
            this.presentAlert("Your booking is registered successfully. Please track the status in 'Booking History' or 'Requested Trips'",["OK"],()=>{
              this.navCtrl.pop();
            });
          }
      });
    } else {
      this.presentAlert("Please fill the mandatory fields 'Schedule Date' & 'Freight'",["OK"], null);
    }
  }

  getTotalAmount(trip?: any, quotation?: any, offer?: any) {
    var total = 0;
    total = total + Number(quotation.cost) + (trip.vat * quotation.cost/100);
    if(offer && offer.discount && offer.discount!="" && offer.discount!=undefined && offer.discount!=null){
      total = total - (quotation.cost * offer.discount / 100);
    }
    return total;
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
