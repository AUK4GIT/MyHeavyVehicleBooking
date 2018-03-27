import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-searched-trip-modal',
  templateUrl: 'searched-trip-modal.html',
})
export class SearchedTripModalPage {
  items: any;
  searchedTrip : any;
  transObj: any;
  
  constructor(translate: TranslateService, private viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    let items = this.navParams.get("trips");
    this.searchedTrip = this.navParams.get("searchedTrip");
    this.items = items.filter((item: any) => {
      console.log("item trucktype:- ",item.trucktype);
      return ((item.startlocation == this.searchedTrip.startlocation) && (item.endlocation == this.searchedTrip.endlocation) && (item.trucktype == this.searchedTrip.trucktype));
    });
    translate.getTranslation(translate.currentLang).subscribe((value)=>{
      this.transObj = value;
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
