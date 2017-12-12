import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, Events } from 'ionic-angular';
import { AppModelServiceProvider, AppUser } from '../../providers/app-model-service/app-model-service';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

import { OwnerTrucksListPage } from '../owner-trucks-list/owner-trucks-list';
import { DriversListPage } from '../drivers-list/drivers-list';
import { OffersListPage } from '../offers-list/offers-list';
import { OwnerTripsListPage } from '../owner-trips-list/owner-trips-list';
import { BookingsListPage } from '../bookings-list/bookings-list';

@IonicPage()
@Component({
  selector: 'page-truck-owner',
  templateUrl: 'truck-owner.html',
})
export class TruckOwnerPage {

  rootPage:any = OwnerTrucksListPage;
  @ViewChild(Nav) nav: Nav;

  constructor(public appService: AppModelServiceProvider, public events: Events, translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TruckOwnerPage');
    
  }

  go_to_TrucksListPage(Page){
    this.nav.setRoot(OwnerTrucksListPage);
  }

  go_to_DriverssListPage(){
    this.nav.setRoot(DriversListPage);  
  }

  go_to_TripsListPage(){
    this.nav.setRoot(OwnerTripsListPage);
  }

  go_to_OffersListPage(){
    this.nav.setRoot(OffersListPage);
  }

  go_to_BookingsListPage(){
    this.nav.setRoot(BookingsListPage);    
  }

  logout_go_to_App(){
    console.log("logout_go_to_App");
    this.events.publish('logout', 'logout');    
  }

}
