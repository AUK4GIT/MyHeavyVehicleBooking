import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ModalController, Modal } from 'ionic-angular';
import { AppModelServiceProvider, AppTruck, AppTrip, AppOffer } from '../../providers/app-model-service/app-model-service'

import { CustomerAddNewTripPage } from '../customer-add-new-trip/customer-add-new-trip';
import { CustomerViewQuotationsPage } from '../customer-view-quotations/customer-view-quotations';
import { Segment } from 'ionic-angular/components/segment/segment';
import { CustomerBookPredfinedTripPage } from '../customer-book-predfined-trip/customer-book-predfined-trip'
import { SearchedTripModalPage } from "../searched-trip-modal/searched-trip-modal"
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-customer-trips-ongoing-list',
  templateUrl: 'customer-trips-ongoing-list.html',
})
export class CustomerTripsOngoingListPage  {
  items: AppTrip[];
  // segment: string;
  search: any;
  searchItems: AppTrip[];
  offers: AppOffer[];
  tripidsofoffer: string[];
  private loading: any;

  tripSearched: boolean;
  searchedTrip: AppTrip;

  pickupcities: any[];
  dropcities: any[];
  trucks: any[];

  pickupcity: string;
  dropcity: string;
  truck: string;
  transObj: any;
  currentLang: string;

  constructor(translate: TranslateService, private modal: ModalController, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {

    translate.getTranslation(translate.currentLang).subscribe((value)=>{
      this.transObj = value;
    });
    this.currentLang = translate.currentLang;
    let tripSearched = localStorage.getItem("tripSearch");


    if (tripSearched == "true") {
      this.tripSearched = true;
      let trip = localStorage.getItem("tripSearched");
      this.searchedTrip = trip ? JSON.parse(trip) : null;
    } else {
      this.tripSearched = false;
      this.searchedTrip = null;
    }

    // if(this.appService.customTripCreated == true){
    //   this.segment = 'customtrips';
    // } else {
    // this.segment = 'availabletrips';
    // }
    this.search = {
      query: ''
    };

    this.tripidsofoffer = [];
    this.offers = [];

    this.pickupcities = [];
    this.dropcities = [];
    this.trucks = [];

    this.pickupcity = "";
    this.dropcity = "";
    this.truck = "";
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad CustomerTripsListPage');

    this.presentLoadingCustom();
    this.appService.getOffers((resp) => {
      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
      } else {
        var offers = resp.data;
        for (var i = 0; i < offers.length; i++) {
          var offer = new AppOffer();
          // this.offers.push(offer.copyInto(offers[i]));
          this.offers.push(offers[i]);
        }
        this.tripidsofoffer = this.offers.map((value) => value.tripid);
      }
    });

    // if (this.segment == 'availabletrips') {
    //   this.loadAvailableTrips();
    // } else {
      this.loadCustomTrips();
    // }
  }

  presentSearchRelatedTrips() {
    if (this.tripSearched == true) {
      const stModal: Modal = this.modal.create(SearchedTripModalPage,{trips: this.items, searchedTrip: this.searchedTrip});
      stModal.present();
      stModal.onDidDismiss((data) => {
        if (data) {
          if (data.trip) {
            // this.afterLogin(data.user[0]);
            this.viewDetailsAndBookPredefinedTrip(data.trip);
          } else {
            this.addNewTrip();
          }
        } else {
          this.addNewTrip();
        }
        this.tripSearched = false;
      });
    }
  }

  isOfferAvailableForTrip(trip) {
    console.log("trip:- " + trip.tripid);
    return (this.tripidsofoffer.length > 0 ? (this.tripidsofoffer.indexOf(trip.tripid) != -1) : false);
  }

  getOfferMessage(trip) {
    var offers = this.offers.filter((item: AppOffer) => (item.tripid == trip.tripid));
    return offers[0].discount + "% "+this.transObj["DISCOUNT"];
  }

  segmentChanged(event) {
    this.clearFilters();
    if (event.value == "availabletrips") {
      this.loadAvailableTrips();
    } else {
      this.loadCustomTrips();
    }
    console.log('segmentChanged CustomerTripsListPage');
  }

  makeFilters() {
    this.pickupcities = this.getUniqueArray(this.items.map((value) => value.startlocation));
    this.dropcities = this.getUniqueArray(this.items.map((value) => value.endlocation));
    this.trucks = this.getUniqueArray(this.items.map((value) => value.trucktype));
  }

  getUniqueArray(array){
    return array.filter((elem, index, array) => {
      return array.indexOf(elem) === index;
    });
  };

  clearFilters() {
    this.pickupcity = "";
    this.dropcity = "";
    this.truck = "";
    this.searchItems = this.items;
  }

  filterSelected(index){
    switch (index) {
      case 1: {
        this.searchItems = this.searchItems.filter((item: AppTrip) => ((item.startlocation.toLowerCase().indexOf(this.pickupcity.toLowerCase()) > -1)));
        break;
      }
      case 2: {
        this.searchItems = this.searchItems.filter((item: AppTrip) => ((item.endlocation.toLowerCase().indexOf(this.dropcity.toLowerCase()) > -1)));
        break;
      }
      case 3: {
        this.searchItems = this.searchItems.filter((item: AppTrip) => ((item.trucktype.toLowerCase().indexOf(this.truck.toLowerCase()) > -1)));
        break;
      }
      default: {
        break;
      }
    }
  }


  loadAvailableTrips() {
    this.presentLoadingCustom();
    this.appService.getAvailableTrips((resp) => {
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
        this.searchItems = this.items;
        this.makeFilters(); 
        this.presentSearchRelatedTrips();
      }
    });
  }

  loadCustomTrips() {
    this.presentLoadingCustom();
    this.appService.getTripsForCustomerid(this.appService.currentUser.userid, (resp) => {
      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, [this.transObj["OK"]], null);
      } else if (resp["data"]) {
        // this.items = resp["data"];
        this.items = resp["data"].map((value) => {
          value.startdate = value.startdate.replace(/\s/g, "T");
          value.startlocation = this.currentLang === 'en' ? value.startlocation_en : value.startlocation_ab;
          value.endlocation = this.currentLang === 'en' ? value.endlocation_en : value.endlocation_ab;
          console.log(value.startlocation +':::::'+value.endlocation);
          return value;
        });
        this.searchItems = this.items;
        this.makeFilters(); 
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

  addNewTrip() {
    this.navCtrl.push(CustomerAddNewTripPage,{ trip: this.searchedTrip });
  }

  viewDetailsAndBookPredefinedTrip(trip) {
    var offers = this.offers.filter((offer: AppOffer) => (offer.tripid == trip.tripid));
    let offer = offers.length > 0 ? offers[0] : null;
    this.navCtrl.push(CustomerBookPredfinedTripPage, {
      trip: trip,
      offer: offer
    });
  }

  viewQuotationsForTrip(trip) {
    console.log("trip: " + trip);
    this.navCtrl.push(CustomerViewQuotationsPage, { trip: trip });
  }

  cancelCustomTrip(trip) {
    let self = this;
    this.presentAlert(this.transObj["WANTCANCELTRIP"], [this.transObj["NO"],this.transObj["YES"]], (type) => {
      if (type == 0) {
        console.log("Delete Cancelled");
      } else {
        console.log("Delete executed");
        self.appService.deleteTrip(trip, (data) => {
          if (data.result == 'success') {
            const index: number = self.items.indexOf(trip);
            self.items.splice(index, 1);
          } else {
            self.presentAlert(this.transObj["DELETEFAILEDTRYAGAIN"], [this.transObj["OK"]], null);
          }
        });
      }
    })
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
