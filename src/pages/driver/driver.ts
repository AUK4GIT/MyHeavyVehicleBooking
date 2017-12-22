import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, Events } from 'ionic-angular';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { AppModelServiceProvider } from '../../providers/app-model-service/app-model-service'

import { DriverTripsListPage } from '../driver-trips-list/driver-trips-list';
import { DriverBookingsListPage } from '../driver-bookings-list/driver-bookings-list';

@IonicPage()
@Component({
  selector: 'page-driver',
  templateUrl: 'driver.html',
})
export class DriverPage {

  rootPage:any = DriverTripsListPage;
  user: any;
  @ViewChild(Nav) nav: Nav;

  constructor(private appService: AppModelServiceProvider, public events: Events, translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {
    this.user = this.appService.currentUser;    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DriverPage');
  }

  go_to_TripsListPage(Page){
    this.nav.setRoot(DriverTripsListPage);
  }

  go_to_BookingsListPage(){
    this.nav.setRoot(DriverBookingsListPage);  
  }

  logout_go_to_App(){
    console.log("logout_go_to_App");
    this.events.publish('logout', 'logout');    
  }
}
