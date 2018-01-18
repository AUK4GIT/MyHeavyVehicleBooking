import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-searched-trip-modal',
  templateUrl: 'searched-trip-modal.html',
})
export class SearchedTripModalPage {
  items: any;
  searchedTrip : any;
  constructor(private viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    let items = this.navParams.get("trips");
    this.searchedTrip = this.navParams.get("searchedTrip");
    this.items = items.filter((item: any) => ((item.startlocation == this.searchedTrip.startlocation) && (item.endlocation == this.searchedTrip.endlocation)));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchedTripModalPage');
  }

  closeTripSearch() {
    this.viewCtrl.dismiss(); 
  }

  selectPredefinedTrip(trip){
    this.viewCtrl.dismiss({ trip: trip });
  }

}
