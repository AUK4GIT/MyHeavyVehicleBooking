import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, Events } from 'ionic-angular';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { AppModelServiceProvider } from '../../providers/app-model-service/app-model-service'

import { CustomerTripsListPage } from '../customer-trips-list/customer-trips-list';
import { CustomerBookingsListPage } from '../customer-bookings-list/customer-bookings-list';

@IonicPage()
@Component({
  selector: 'page-customer',
  templateUrl: 'customer.html',
})
export class CustomerPage {

  rootPage:any = CustomerTripsListPage;
  user: any;
  pageIndex: Number;
  @ViewChild(Nav) nav: Nav;

  constructor(private appService: AppModelServiceProvider, public events: Events, translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {
    this.pageIndex = 1;
    this.user = this.appService.currentUser;    
  }

  checkActivated(page) {
    return (page == this.pageIndex);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerPage');
  }

  go_to_TripsListPage(){
    this.pageIndex = 1;
    this.nav.setRoot(CustomerTripsListPage);
  }

  go_to_BookingsListPage(){
    this.pageIndex = 2;
    this.nav.setRoot(CustomerBookingsListPage);  
  }

  logout_go_to_App(){
    console.log("logout_go_to_App");
    this.pageIndex = 3;
    this.events.publish('logout', 'logout');    
  }
}
