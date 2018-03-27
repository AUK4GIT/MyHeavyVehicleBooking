import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AppModelServiceProvider, AppTruck, AppTrip, AppOffer } from '../../providers/app-model-service/app-model-service'
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-admin-customer-trips-list',
  templateUrl: 'admin-customer-trips-list.html',
})
export class AdminCustomerTripsListPage {
  items: AppTrip[];
  segment: string;
  search: any;
  searchItems: AppTrip[];
  offers: AppOffer[];
  offerIds: string[];
  private loading: any;
  user : any;
  transObj: any;

  constructor(translate: TranslateService, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    
    translate.getTranslation(translate.currentLang).subscribe((value)=>{
      this.transObj = value;
    });
    
    this.user = this.navParams.get("user");
    // if(this.appService.customTripCreated == true){
    //   this.segment = 'customtrips';
    // } else {
    //   this.segment = 'availabletrips';
    // }
    this.search = {
      query: ''
    };
    var offers = JSON.parse(localStorage.getItem("offers"));
    this.offers = [];
    this.offerIds = [];
    if (offers) {
      for (var i = 0; i < offers.length; i++) {
        var offer = new AppOffer();
        // this.offers.push(offer.copyInto(offers[i]));
        this.offers.push(offers[i]);
      }
      this.offerIds = offers.map((value) => value.tripid);
    }

  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad CustomerTripsListPage');
    this.getAllTripsForId();
    // if(this.segment == 'availabletrips'){
    //   this.loadAvailableTrips();      
    // }  else {
    //   this.loadCustomTrips();      
    // } 
  }

  isOfferAvailableForTrip(trip){
    return (this.offerIds.length>0 ? (this.offerIds.indexOf(trip.tripid) != -1) : false);
  }

  getOfferMessage(trip) {
    var offers = this.offers.filter((item: AppOffer) => (item.tripid == trip.tripid));
    return offers[0].discount+"% "+this.transObj["DISCOUNT"];
  }

  // segmentChanged(event) {
  //   if(event.value == "availabletrips") {
  //     this.loadAvailableTrips();
  //   } else {
  //     this.loadCustomTrips();
  //   }
  //   console.log('segmentChanged CustomerTripsListPage');    
  // }

  // loadAvailableTrips() {
  //   this.presentLoadingCustom();
  //   this.appService.getAvailableTrips((resp)=>{
  //     this.dismissLoading();
  //     if (resp.result == "failure") {
  //       console.log("resp.error");
  //       this.presentAlert(resp.error, [this.transObj["OK"]], null);
  //     } else if (resp["data"]) {
  //       this.items = resp["data"];
  //       this.searchItems = this.items;           
  //     }
  //   }); 
  // }

  getAllTripsForId() {
    this.presentLoadingCustom();
    this.appService.getAllTripsForId(this.user.userid, (resp) => {
      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, [this.transObj["OK"]], null);
      } else if (resp["data"]) {
        // this.items = resp["data"];
        this.items = resp["data"].map((value) => {
          value.startdate = value.startdate.replace(/\s/g, "T");
          return value;
        });
      }
    });            
  }

  updateSearch() {
    console.log('modal > updateSearch');
    if (this.search.query == '') {
      this.searchItems = this.items;
      return;
    }
    
    this.searchItems = this.items.filter((item: AppTrip) => ((item.startlocation.toLowerCase().indexOf(this.search.query.toLowerCase()) > -1) || item.endlocation.toLowerCase().indexOf(this.search.query.toLowerCase()) > -1) || (item.trucktype.toLowerCase().indexOf(this.search.query.toLowerCase()) > -1));
  }

  dismiss() {
    
  }

  // addNewTrip(){
  //   this.navCtrl.push(CustomerAddNewTripPage);
  // }

  // viewDetailsAndBookPredefinedTrip(trip) {
  //   this.navCtrl.push(CustomerBookPredfinedTripPage, {
  //     trip: trip
  //   }); 
  //  }

  // viewQuotationsForTrip(trip) {
  //   console.log("trip: "+trip);
  //   this.navCtrl.push(CustomerViewQuotationsPage, { trip: trip});    
  // }

  // cancelCustomTrip(trip) {
  //   let self = this;
  //   this.presentAlert(this.transObj["WANTCANCELTRIP"], [this.transObj["NO"],"Yes"], (type) => {
  //     if(type == 0){
  //       console.log("Delete Cancelled");
  //     } else {
  //       console.log("Delete executed");
  //       self.appService.deleteTrip(trip, (data) => {
  //         if(data.result == 'success') {
  //           const index: number = self.items.indexOf(trip);
  //           self.items.splice(index,1);
  //         } else {
  //           self.presentAlert(this.transObj["DELETEFAILEDTRYAGAIN"], [this.transObj["OK"]], null);
  //         }
  //       });
  //     }
  //   })
  // }

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
  
  dismissLoading(){
    if(this.loading){
        this.loading.dismiss();
        this.loading = null;
    }
}
}
