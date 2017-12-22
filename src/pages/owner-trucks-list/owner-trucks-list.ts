import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppModelServiceProvider, AppTruck } from '../../providers/app-model-service/app-model-service'
import { OwnerAddTruckPage } from '../owner-add-truck/owner-add-truck';

@Component({
  selector: 'page-owner-trucks-list',
  templateUrl: 'owner-trucks-list.html',
})
export class OwnerTrucksListPage {
  items: AppTruck[];
  constructor(private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidEnter() {
    this.items = this.appService.getTrucksForOwnerid(this.appService.currentUser.userid);        
    console.log('ionViewDidLoad OwnerTrucksListPage');
  }

  onModelChange(event) {

  }

  addTruck() {
    this.navCtrl.push(OwnerAddTruckPage);
  }

}
