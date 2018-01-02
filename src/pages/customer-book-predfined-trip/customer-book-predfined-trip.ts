import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AppModelServiceProvider, AppQuotation, AppUser, AppTrip } from '../../providers/app-model-service/app-model-service';


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

  constructor(private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.trip = this.navParams.get("trip");  
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
    this.quotation = this.appService.getQuotationForId(this.trip.quoteidforpretrip);  
    this.owner = this.appService.getUserById(this.quotation.ownerid);
  }

  bookTrip() {
    if(this.trip.startdate && this.trip.freight && true) {
      this.appService.createNewCompleteTripForPredefinedTripBooking(this.trip, this.quotation, this.appService.currentUser.userid);
      this.presentAlert("Your booking is registered successfully. Please track the status in 'Booking History' or 'Custom Trips'",["OK"],()=>{
        this.navCtrl.pop();
      });
    } else {
      this.presentAlert("Please fill the mandatory fields 'Schedule Date' & 'Freight'",["OK"], null);
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
