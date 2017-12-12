import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppModelServiceProvider, AppUser } from '../../providers/app-model-service/app-model-service'

/**
 * Generated class for the CustomersListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-customers-list',
  templateUrl: 'customers-list.html',
})
export class CustomersListPage {
  items: [AppUser];
  constructor(private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.items = this.appService.getUsersByRole("customer");            
    console.log('ionViewDidLoad CustomersListPage');
  }

}
