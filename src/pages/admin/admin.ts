import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, Events } from 'ionic-angular';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

import { TrucksListPage } from '../trucks-list/trucks-list';
import { TruckOwnersListPage } from '../truck-owners-list/truck-owners-list';
import { CustomersListPage } from '../customers-list/customers-list';
import { TripsListPage } from '../trips-list/trips-list';

/**
 * Generated class for the AdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {
  rootPage:any = TrucksListPage;
  @ViewChild(Nav) nav: Nav;
  constructor(public events: Events, translate: TranslateService,public navCtrl: NavController, public navParams: NavParams) {
    // translate.setDefaultLang('ar-sa');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');
  }

  go_to_TrucksListPage(Page){
    this.nav.setRoot(TrucksListPage);
  }

  go_to_TruckOwnersListPage(){
    this.nav.setRoot(TruckOwnersListPage);  
  }

  go_to_CustomersListPage(){
    this.nav.setRoot(CustomersListPage);
  }

  go_to_TripsListPage(){
    this.nav.setRoot(TripsListPage);
  }

  logout_go_to_App(){
    console.log("logout_go_to_App");
    this.events.publish('logout', 'logout');    
  }
  
}
