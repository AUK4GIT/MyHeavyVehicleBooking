import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppModelServiceProvider, AppUser } from '../../providers/app-model-service/app-model-service'
import { OwnerAddDriverPage } from '../owner-add-driver/owner-add-driver';

@Component({
  selector: 'page-drivers-list',
  templateUrl: 'drivers-list.html',
})
export class DriversListPage {
  items: [AppUser];
  constructor(private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.items = this.appService.getUsersByRole("driver");            
    console.log('ionViewDidLoad DriversListPage');
  }

  addDriver(){
    this.navCtrl.push(OwnerAddDriverPage);
  }

}
