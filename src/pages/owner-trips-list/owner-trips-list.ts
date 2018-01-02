import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AppModelServiceProvider, AppTrip } from '../../providers/app-model-service/app-model-service'
import { OwnerTripQuotationPage } from '../owner-trip-quotation/owner-trip-quotation';
import { OwnerCreateTripPage } from '../owner-create-trip/owner-create-trip'

@Component({
  selector: 'page-owner-trips-list',
  templateUrl: 'owner-trips-list.html',
})
export class OwnerTripsListPage {
  items: AppTrip[];
  segment: string;
  search: any;
  searchItems: AppTrip[];

  constructor(private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.segment = 'availabletrips';
    this.search = {
      query: ''
    };
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad OwnerTripsListPage');
    if(this.segment == 'availabletrips'){
      this.loadAvailableTrips();      
    }  else {
      this.loadCustomTrips();      
    } 
  }

  loadAvailableTrips() {
    this.items = this.appService.getOwnerAvailableTrips(this.appService.currentUser.userid);            
    this.searchItems = this.items;           
  }

  loadCustomTrips() {
    this.items = this.appService.getCustomPendingTrips();            
  }

  segmentChanged(event) {
    if(event.value == "availabletrips") {
      this.loadAvailableTrips();
    } else {
      this.loadCustomTrips();
    }
    console.log('segmentChanged CustomerTripsListPage');    
  }

  editTrip(trip) {
    // this.navCtrl.push(OwnerTripQuotationPage, { tripid: trip.tripid, trucktype: trip.trucktype});    
  }

  giveQuotationsForTrip(trip){
        this.navCtrl.push(OwnerTripQuotationPage, { tripid: trip.tripid, trucktype: trip.trucktype, status:trip.status});    
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

  deleteAvailableTrip(trip) {
    {
      let self = this;
      this.presentAlert("Do you want to Delete this trip ?", ["No","Yes"], (type) => {
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
  }

  createTrip() {
    this.navCtrl.push(OwnerCreateTripPage);
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
