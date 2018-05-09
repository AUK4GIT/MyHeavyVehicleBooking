import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AppModelServiceProvider, AppUser, AppTruck } from '../../providers/app-model-service/app-model-service'
import { TranslateService } from '@ngx-translate/core';

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
discount: string;
private loading: any;
buttontitle : string;
updatemode: boolean;
istripcompleted: boolean;
rating: string;

trip: any;
quotation: any;
transObj: any;

  constructor(translate: TranslateService, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    let trip = this.navParams.get("trip");
    this.trip = trip;
    this.tripid = trip.tripid;
    this.trucktype = trip.trucktype;
    this.tripstatus = trip.status;
    this.discount = trip.offerdiscount;
    this.buttontitle = "Add Quotation";
    this.rating = trip.rating;
    this.updatemode = false;
    this.istripcompleted = false;
    translate.getTranslation(translate.currentLang).subscribe((value)=>{
      this.transObj = value;
    });
  }

  ionViewDidLoad() {
    
    this.presentLoadingCustom();
    this.appService.getDriversForOwner(this.appService.currentUser.userid, (resp) => {
      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, [this.transObj["OK"]], null);
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
        this.presentAlert(resp.error, [this.transObj["OK"]], null);
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
        this.presentAlert(resp.error, [this.transObj["OK"]], null);
      } else if (resp["data"]) {
        this.trucks = resp["data"];
      }
    });  
    console.log('ionViewDidLoad OwnerTripQuotationPage');
  }

  setQuotation(quotation){
    this.quotation = quotation;
    if (this.tripstatus == "pending") {
      this.buttontitle = "Add Quotation";
      this.updatemode = false;
    } else if (this.tripstatus == "requested") {
      this.buttontitle = "Update Quotation";
      this.updatemode = true;
    } else if (this.tripstatus == "confirmed") {
      this.buttontitle = "Complete Trip";
      this.updatemode = true;
    } else if (this.tripstatus == "completed") {
      this.buttontitle = "Update Quotation";
      this.updatemode = false;
      this.istripcompleted = true;
    } else {
      this.buttontitle = "Update Quotation";
      this.updatemode = true;
    }
    if(quotation){
      // this.buttontitle = "Update Quotation";
      this.updatemode = true;
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
    } else if(this.tripstatus == "confirmed"){
      this.completeTrip();
    } else {
      this.updateQuote();//by adding driver
    }
  }

  completeTrip(){
    this.quotation.comments = this.comments;
    this.quotation.additionalcharges = this.charges;
    this.presentLoadingCustom();
    this.appService.completeTripWithId(this.trip.tripid, this.quotation.quotationid, this.quotation.comments, this.quotation.additionalcharges, (resp)=>{
      this.dismissLoading();
      if(resp.result == "failure"){
        console.log("resp.error");
        this.presentAlert(resp.error, [this.transObj["OK"]], null);
      } else if (resp["message"]) {
        this.presentConfirm();
      }
    });
  }

  addQuotation() {
    if (this.cost ) {
      this.presentLoadingCustom();
      this.appService.addQuotationForTrip({
        truck: this.trucktype,
        driver: this.driver,
        duration: this.duration,
        cost: this.cost,
        status: "pending",
        starttime: this.starttime,
        closetime: this.closetime,
        // additionalcharges: this.charges,
        comments: this.comments,
        appliedofferid: "",
        discount: "",
        tripid: this.tripid,
        ownerid: this.appService.currentUser.userid,
        ownername: this.appService.currentUser.name,
        truckid: this.truckid,
        userid: this.trip.userid
      }, (resp) => {
        this.dismissLoading();
        if (resp.result == "failure") {
          console.log("resp.error");
          this.presentAlert(resp.error, [this.transObj["OK"]], null);
        } else if (resp["message"]) {
          this.presentAlert(this.transObj["QUOTATIONRECORDED"], [this.transObj["OK"]], () => {
            this.navCtrl.pop();
          });
        }
      });
    } else {
      this.presentAlert(this.transObj["FILLCOST"], [this.transObj["OK"]], () => {});
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
        // additionalcharges: this.charges,
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
        this.presentAlert(resp.error, [this.transObj["OK"]], null);
      } else if (resp["message"]) {
        this.presentAlert(this.transObj["OWNERCONFIRMEDTRIP"], [this.transObj["OK"]], ()=>{
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

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: this.transObj["RENTATRUCK"],
      message: this.transObj["TRIPCOMPLETED"],
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
  
  dismissLoading(){
    if(this.loading){
        this.loading.dismiss();
        this.loading = null;
    }
}
}
