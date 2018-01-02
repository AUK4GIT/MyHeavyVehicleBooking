import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AppModelServiceProvider, AppUser, AppTruck } from '../../providers/app-model-service/app-model-service'

@Component({
  selector: 'page-owner-trip-quotation',
  templateUrl: 'owner-trip-quotation.html',
})
export class OwnerTripQuotationPage {
driver: string;
cost: string;
starttime: string;
closetime: string;
comments: string;
charges: string;
truckid: string;
tripid: string;
trucktype: string;
duration: string;
drivers: AppUser[];
trucks: AppTruck[];
quotationid: string;
tripstatus: string;

  constructor(private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.tripid = this.navParams.get("tripid");
    this.trucktype = this.navParams.get("trucktype");
    this.tripstatus = this.navParams.get("status");
    this.drivers = this.appService.getDriversForOwner(this.appService.currentUser.userid);
    this.trucks = this.appService.getTrucksForOwnerid(this.appService.currentUser.userid);
    
    this.appService.getQuotationsForTripIdOwnerId(this.tripid, this.appService.currentUser.userid, (quotation) => {
      if(quotation){
        this.trucktype = quotation.truck,
        this.driver = quotation.driver,
        this.duration = quotation.duration,
        this.cost = quotation.cost,
        this.starttime = quotation.starttime,
        this.closetime = quotation.closetime,
        this.charges = quotation.additionalcharges,
        this.comments = quotation.comments,
        this.tripid = quotation.tripid,
        this.appService.currentUser.userid = quotation.ownerid,
        this.appService.currentUser.name = quotation.ownername,
        this.truckid = quotation.truckid
        this.quotationid = quotation.quotationid;
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OwnerTripQuotationPage');
  }

  focusFunction() {
  }

  addQuote() {
    if (this.tripstatus == "pending") {
      this.addQuotation();
    } else if (this.tripstatus == "requested") {
      this.updateQuote();
    }
  }

  addQuotation() {
    if(this.cost && this.starttime){
      this.appService.addQuotationForTrip({
        truck: this.trucktype,
        driver: this.driver,
        duration: this.duration,
        cost: this.cost,
        status: "",
        starttime: this.starttime,
        closetime: this.closetime,
        additionalcharges: this.charges,
        comments: this.comments,
        appliedofferid: "",
        discount: "",
        tripid: this.tripid,
        ownerid: this.appService.currentUser.userid,
        ownername: this.appService.currentUser.name,
        truckid: this.truckid
    }, ()=>{
      this.presentAlert("Your quotation is recorded and available to the customer. You will be intimated when the customer confirms your quotation.",["OK"],()=>{
        this.navCtrl.pop();
      });
    });
    }     
  }

  updateQuote() {
    if(this.cost && this.starttime && true){
      this.appService.updateQuotationForTripAndConfirm({
        truck: this.trucktype,
        driver: this.driver,
        duration: this.duration,
        cost: this.cost,
        status: "",
        starttime: this.starttime,
        closetime: this.closetime,
        additionalcharges: this.charges,
        comments: this.comments,
        appliedofferid: "",
        discount: "",
        tripid: this.tripid,
        ownerid: this.appService.currentUser.userid,
        ownername: this.appService.currentUser.name,
        truckid: this.truckid,
        quotationid : this.quotationid
    }, ()=>{
      this.presentAlert("You have confirmed the trip. The user will be intimated and can communicate with the driver.",["OK"],()=>{
        this.navCtrl.pop();
      });
    });
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
