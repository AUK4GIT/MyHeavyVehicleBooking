import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
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
private loading: any;
buttontitle : string;

  constructor(private loadingCtrl: LoadingController, private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    // let self = this;
    this.tripid = this.navParams.get("tripid");
    this.trucktype = this.navParams.get("trucktype");
    this.tripstatus = this.navParams.get("status");
    this.buttontitle = "Add Quotation";
  }

  ionViewDidLoad() {
    
    this.presentLoadingCustom();
    this.appService.getDriversForOwner(this.appService.currentUser.userid, (resp) => {
      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, ["OK"], null);
      } else if (resp["data"]) {
        this.drivers = resp["data"];
      }
    });
    // this.drivers = this.appService.getDriversForOwner(this.appService.currentUser.userid);
    // this.trucks = this.appService.getTrucksForOwnerid(this.appService.currentUser.userid);
    
    this.appService.getQuotationsForTripIdOwnerId(this.tripid, this.appService.currentUser.userid, (resp) => {

      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, ["OK"], null);
      } else if (resp["data"]) {
        if(resp["data"].length > 0){
          var quotation = resp["data"][0];
          this.setQuotation(quotation);
        }
      }
    })
    this.appService.getTrucksForOwnerid(this.appService.currentUser.userid, (resp)=>{
      this.dismissLoading();
      if(resp.result == "failure"){
        console.log("resp.error");
        this.presentAlert(resp.error, ["OK"], null);
      } else if (resp["data"]) {
        this.trucks = resp["data"];
      }
    });  
    console.log('ionViewDidLoad OwnerTripQuotationPage');
  }

  setQuotation(quotation){
    if (this.tripstatus == "pending") {
      this.buttontitle = "Add Quotation";
    } else if (this.tripstatus == "requested") {
      this.buttontitle = "Update Quotation";
    } else {
      this.buttontitle = "Update Quotation";
    }
    if(quotation){
      this.buttontitle = "Update Quotation";

      this.trucktype = quotation.truck,
      this.duration = quotation.duration,
      this.cost = quotation.cost,
      this.starttime = quotation.starttime,
      this.closetime = quotation.closetime,
      this.charges = quotation.additionalcharges,
      this.comments = quotation.comments,
      this.appService.currentUser.userid = quotation.ownerid,
      this.quotationid = quotation.quotationid;

            // this.tripid = quotation.tripid,
            this.appService.currentUser.name = quotation.ownername,
            this.driver = quotation.driver,
            this.truckid = (quotation.truckid && quotation.truckid!="") ? (quotation.truckid) : (this.trucks.filter((truck: AppTruck)=>{ return truck.type == quotation.truck})[0].truckid);

    }
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
    if (this.cost && true) {
      this.presentLoadingCustom();
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
      }, (resp) => {
        this.dismissLoading();
        if (resp.result == "failure") {
          console.log("resp.error");
          this.presentAlert(resp.error, ["OK"], null);
        } else if (resp["message"]) {
          this.presentAlert("Your quotation is recorded and available to the customer. You will be intimated when the customer confirms your quotation.", ["OK"], () => {
            this.navCtrl.pop();
          });
        }
      });
    }     
  }

  updateQuote() {
    if(this.cost && true){
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
    }, (resp)=>{
      this.dismissLoading();
      if(resp.result == "failure"){
        console.log("resp.error");
        this.presentAlert(resp.error, ["OK"], null);
      } else if (resp["message"]) {
        this.presentAlert("You have confirmed the trip. The user will be intimated and can communicate with the driver.", ["OK"], ()=>{
            this.navCtrl.pop();
        });
      }
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
