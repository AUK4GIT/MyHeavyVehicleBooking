import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppModelServiceProvider, AppTruck, AppTrip } from '../../providers/app-model-service/app-model-service'

import { CustomerAddNewTripPage } from '../customer-add-new-trip/customer-add-new-trip';
import { CustomerViewQuotationsPage } from '../customer-view-quotations/customer-view-quotations';
import { Segment } from 'ionic-angular/components/segment/segment';

@Component({
  selector: 'page-customer-trips-list',
  templateUrl: 'customer-trips-list.html',
})
export class CustomerTripsListPage {
  items: AppTrip[];
  segment: string;
  search: any;

  constructor(private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.segment = 'availabletrips';
    this.search = {
      query: ''
    };
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad CustomerTripsListPage');
    if(this.segment == 'availabletrips'){
      this.loadAvailableTrips();      
    }  else {
      this.loadCustomTrips();      
    } 
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
  }

  loadCustomTrips() {
    this.items = this.appService.getTripsForCustomerid(this.appService.currentUser.userid);            
  }

  updateSearch() {
    console.log('modal > updateSearch');
    if (this.search.query == '') {
      // this.autocompleteItems = [];
      return;
    }
    let self = this;
  }


  addNewTrip(){
    this.navCtrl.push(CustomerAddNewTripPage);
  }

  viewQuotationsForTrip(trip) {
    console.log("trip: "+trip);
    this.navCtrl.push(CustomerViewQuotationsPage, { trip: trip});    
  }

}
