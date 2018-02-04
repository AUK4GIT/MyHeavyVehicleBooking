import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, Events } from 'ionic-angular';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { AppModelServiceProvider } from '../../providers/app-model-service/app-model-service'

import { CustomerTripsListPage } from '../customer-trips-list/customer-trips-list';
import { CustomerBookingsListPage } from '../customer-bookings-list/customer-bookings-list';
import { CustomerTripsOngoingListPage } from "../customer-trips-ongoing-list/customer-trips-ongoing-list"

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

  getProfileImage(){
    var imgPath = "user_"+this.user.userid+"/thumb_"+this.user.userid+".jpeg";
    return "http://zamilrenttruck.com/images/profiles/"+imgPath;
  }

  go_to_TripsListPage(){
    this.pageIndex = 1;
    this.nav.setRoot(CustomerTripsListPage);
  }

  go_to_OngoingTripsListPage(){
    this.pageIndex = 2;
    this.nav.setRoot(CustomerTripsOngoingListPage);
  }

  go_to_BookingsListPage(){
    this.pageIndex = 3;
    this.nav.setRoot(CustomerBookingsListPage);  
  }

  logout_go_to_App(){
    console.log("logout_go_to_App");
    this.pageIndex = 4;
    this.events.publish('logout', 'logout');    
  }
}
