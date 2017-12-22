import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppModelServiceProvider, AppTrip } from '../../providers/app-model-service/app-model-service'

@Component({
  selector: 'page-trips-list',
  templateUrl: 'trips-list.html',
})
export class TripsListPage {
  items: AppTrip[];
  constructor(private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.items = this.appService.getTrips();            
    console.log('ionViewDidLoad TripsListPage: '+this.items.length);
  }

}
