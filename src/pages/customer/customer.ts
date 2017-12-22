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
  @ViewChild(Nav) nav: Nav;

  constructor(private appService: AppModelServiceProvider, public events: Events, translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {
    this.user = this.appService.currentUser;    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerPage');
  }

  go_to_TripsListPage(){
    this.nav.setRoot(CustomerTripsListPage);
  }

  go_to_BookingsListPage(){
    this.nav.setRoot(CustomerBookingsListPage);  
  }

  logout_go_to_App(){
    console.log("logout_go_to_App");
    this.events.publish('logout', 'logout');    
  }
}
