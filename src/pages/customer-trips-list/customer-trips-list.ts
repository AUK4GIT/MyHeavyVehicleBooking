import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AppModelServiceProvider, AppTruck, AppTrip, AppOffer } from '../../providers/app-model-service/app-model-service'

import { CustomerAddNewTripPage } from '../customer-add-new-trip/customer-add-new-trip';
import { CustomerViewQuotationsPage } from '../customer-view-quotations/customer-view-quotations';
import { Segment } from 'ionic-angular/components/segment/segment';
import { CustomerBookPredfinedTripPage } from '../customer-book-predfined-trip/customer-book-predfined-trip'

@Component({
  selector: 'page-customer-trips-list',
  templateUrl: 'customer-trips-list.html',
})
export class CustomerTripsListPage {
  items: AppTrip[];
  segment: string;
  search: any;
  searchItems: AppTrip[];
  offers: AppOffer[];
  offerIds: string[];

  constructor(private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.segment = 'availabletrips';
    this.search = {
      query: ''
    };
    var offers = JSON.parse(localStorage.getItem("offers"));
    this.offers = [];
    for(var i=0; i<offers.length; i++){
      var offer = new AppOffer();
      // this.offers.push(offer.copyInto(offers[i]));
      this.offers.push(offers[i]);
    }

    this.offerIds = offers.map((value) => value.tripid);
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad CustomerTripsListPage');
    if(this.segment == 'availabletrips'){
      this.loadAvailableTrips();      
    }  else {
      this.loadCustomTrips();      
    } 
  }

  isOfferAvailableForTrip(trip){
    return (this.offerIds.indexOf(trip.tripid) != -1);
  }

  getOfferMessage(trip) {
    var offers = this.offers.filter((item: AppOffer) => (item.tripid == trip.tripid));
    return offers[0].discount+"% discount";
  }

  segmentChanged(event) {
    if(event.value == "availabletrips") {
      this.loadAvailableTrips();
    } else {
      this.loadCustomTrips();
    }
    console.log('segmentChanged CustomerTripsListPage');    
  }

  loadAvailableTrips() {
    this.items = this.appService.getAvailableTrips(); 
    this.searchItems = this.items;           
  }

  loadCustomTrips() {
    this.items = this.appService.getTripsForCustomerid(this.appService.currentUser.userid);            
  }

  updateSearch() {
    console.log('modal > updateSearch');
    if (this.search.query == '') {
      this.searchItems = this.items;
      return;
    }
    
    this.searchItems = this.items.filter((item: AppTrip) => ((item.startlocation.toLowerCase().indexOf(this.search.query.toLowerCase()) > -1) || item.endlocation.toLowerCase().indexOf(this.search.query.toLowerCase()) > -1));
  }

  dismiss() {
    
  }

  addNewTrip(){
    this.navCtrl.push(CustomerAddNewTripPage);
  }

  viewDetailsAndBookPredefinedTrip(trip) {
    this.navCtrl.push(CustomerBookPredfinedTripPage, {
      trip: trip
    }); 
   }

  viewQuotationsForTrip(trip) {
    console.log("trip: "+trip);
    this.navCtrl.push(CustomerViewQuotationsPage, { trip: trip});    
  }

  cancelCustomTrip(trip) {
    let self = this;
    this.presentAlert("Do you want to Cancel the trip ?", ["No","Yes"], (type) => {
      if(type == 0){
        console.log("Delete Cancelled");
      } else {
        console.log("Delete executed");
        self.appService.deleteTrip(trip, (data) => {
          if(data.result == 'success') {
            const index: number = self.items.indexOf(trip);
            self.items.splice(index,1);
          } else {
            self.presentAlert("Delete UnSuccessful! Try again", ["OK"], null);
          }
        });
      }
    })
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
