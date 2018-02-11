import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-admin-trip-details',
  templateUrl: 'admin-trip-details.html',
})
export class AdminTripDetailsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminTripDetailsPage');
  }

}
