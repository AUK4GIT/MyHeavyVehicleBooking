import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppModelServiceProvider, AppTruck } from '../../providers/app-model-service/app-model-service'

/**
 * Generated class for the TrucksListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-trucks-list',
  templateUrl: 'trucks-list.html',
})
export class TrucksListPage {
  items: AppTruck[];
  constructor(private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.items = this.appService.getTrucks();  
    console.log('ionViewDidLoad TrucksListPage: '+this.items.length);
    
  }

}
