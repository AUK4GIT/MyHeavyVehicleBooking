import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, Events } from 'ionic-angular';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { AppModelServiceProvider } from '../../providers/app-model-service/app-model-service'

import { TrucksListPage } from '../trucks-list/trucks-list';
import { TruckOwnersListPage } from '../truck-owners-list/truck-owners-list';
import { CustomersListPage } from '../customers-list/customers-list';
import { TripsListPage } from '../trips-list/trips-list';

@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {
  rootPage:any = TrucksListPage;
  user: any;
  pageIndex: Number;
  @ViewChild(Nav) nav: Nav;
  constructor(private appService: AppModelServiceProvider, public events: Events, translate: TranslateService,public navCtrl: NavController, public navParams: NavParams) {
    // translate.setDefaultLang('ar-sa');
    this.pageIndex = 1;
    this.user = this.appService.currentUser;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');
  }

  checkActivated(page) {
    return (page == this.pageIndex);
  }

  go_to_TrucksListPage(Page){
    this.pageIndex = 1;
    this.nav.setRoot(TrucksListPage);
  }

  go_to_TruckOwnersListPage(){
    this.pageIndex = 2;
    this.nav.setRoot(TruckOwnersListPage);  
  }

  go_to_CustomersListPage(){
    this.pageIndex = 3;
    this.nav.setRoot(CustomersListPage);
  }

  go_to_TripsListPage(){
    this.pageIndex = 4;
    this.nav.setRoot(TripsListPage);
  }

  logout_go_to_App(){
    this.pageIndex = 5;
    console.log("logout_go_to_App");
    this.events.publish('logout', 'logout');    
  }
  
}
