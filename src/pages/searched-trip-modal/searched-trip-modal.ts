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
    this.items = items.filter((item: any) => {
      console.log("item trucktype:- ",item.trucktype);
      return ((item.startlocation == this.searchedTrip.startlocation) && (item.endlocation == this.searchedTrip.endlocation) && (item.trucktype == this.searchedTrip.trucktype));
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchedTripModalPage');
    if(this.items.length == 0){
      let items = this.navParams.get("trips");
      this.items = items.filter((item: any) => ((item.startlocation == this.searchedTrip.startlocation) && (item.endlocation == this.searchedTrip.endlocation)));
    }
  }

  closeTripSearch() {
    this.viewCtrl.dismiss(); 
  }

  selectPredefinedTrip(trip){
    this.viewCtrl.dismiss({ trip: trip });
  }

}
