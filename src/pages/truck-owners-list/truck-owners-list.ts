import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppModelServiceProvider, AppUser } from '../../providers/app-model-service/app-model-service';

/**
 * Generated class for the TruckOwnersListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-truck-owners-list',
  templateUrl: 'truck-owners-list.html',
})
export class TruckOwnersListPage {
  owners: [AppUser];  
  constructor(public appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TruckOwnersListPage');
    this.owners = this.appService.getUsersByRole('owner');
    
  }

}
