import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AppModelServiceProvider, AppTrip } from '../../providers/app-model-service/app-model-service'
import { OwnerTripQuotationPage } from '../owner-trip-quotation/owner-trip-quotation';
import { OwnerCreateTripPage } from '../owner-create-trip/owner-create-trip'
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-owner-trips-ongoing-list',
  templateUrl: 'owner-trips-ongoing-list.html',
})
export class OwnerTripsOngoingListPage {
  items: AppTrip[];
  segment: string;
  search: any;
  searchItems: AppTrip[];
  private loading: any;

  pickupcities: any[];
  dropcities: any[];
  trucks: any[];

  pickupcity: string;
  dropcity: string;
  truck: string;
  transObj: any;
  currentLang: string;

  order: number=1;
  column: string = 'startdate';
  arrow: string = 'down';


  constructor(translate: TranslateService, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.segment = 'mytrips';
    this.search = {
      query: ''
    };
    this.pickupcities = [];
    this.dropcities = [];
    this.trucks = [];

    this.pickupcity = "";
    this.dropcity = "";
    this.truck = "";

    translate.getTranslation(translate.currentLang).subscribe((value)=>{
      this.transObj = value;
    });
    this.currentLang = translate.currentLang;
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad OwnerTripsListPage');
    if(this.segment == 'mytrips'){
      this.loadAvailableTrips();      
    }  else {
      this.loadCustomTrips();      
    } 
  }

  changeSort(ele) {
    if(this.column === ele){
      this.arrow = this.arrow=='up' ? 'down' : 'up';
      this.order = this.order==-1  ? 1: -1;
    }else{
      this.order = 1;
      this.arrow = 'down';
    }
    this.column = ele;    
  }

  makeFilters() {
    this.pickupcities = this.getUniqueArray(this.items.map((value) => value.startlocation));
    this.dropcities = this.getUniqueArray(this.items.map((value) => value.endlocation));
    this.trucks = this.getUniqueArray(this.items.map((value) => value.trucktype));
  }

  getUniqueArray(array){
    return array.filter((elem, index, array) => {
      return array.indexOf(elem) === index;
    });
  };

  clearFilters() {
    this.pickupcity = "";
    this.dropcity = "";
    this.truck = "";
    this.searchItems = this.items;
  }

  filterSelected(index){
    switch (index) {
      case 1: {
        this.searchItems = this.searchItems.filter((item: AppTrip) => ((item.startlocation.toLowerCase().indexOf(this.pickupcity.toLowerCase()) > -1)));
        break;
      }
      case 2: {
        this.searchItems = this.searchItems.filter((item: AppTrip) => ((item.endlocation.toLowerCase().indexOf(this.dropcity.toLowerCase()) > -1)));
        break;
      }
      case 3: {
        this.searchItems = this.searchItems.filter((item: AppTrip) => ((item.trucktype.toLowerCase().indexOf(this.truck.toLowerCase()) > -1)));
        break;
      }
      default: {
        break;
      }
    }
  }

  loadAvailableTrips() {
    this.presentLoadingCustom();
    this.appService.getRequestedTripsForOwnerid(this.appService.currentUser.userid, (resp) => {
      console.log('Owner requested trips and accepted trips');
      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, [this.transObj["OK"]], null);
      } else if (resp["data"]) {
        // this.items = resp["data"];
        this.items = resp["data"].map((value) => {
          value.startdate = value.startdate.replace(/\s/g, "T");
          value.startlocation = (this.currentLang === 'en') ? value.startlocation_en : value.startlocation_ab;
          value.endlocation = (this.currentLang === 'en') ? value.endlocation_en : value.endlocation_ab;
          value.imagepath = "http://zamilrenttruck.com/images/profiles/user_"+value.userid+"/thumb_"+value.userid+".jpeg";
          value.cost = Number(value.cost);
          value.duration = Number(value.duration);
          return value;
        });
        this.searchItems = this.items;
        console.log('Came to search Items:::::',this.searchItems.length);
        this.makeFilters();           
      }
    });
  }

  loadCustomTrips() {
    this.presentLoadingCustom();
    this.appService.getCustomPendingTrips((resp) => {
      console.log('Customer pending requests');
      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, [this.transObj["OK"]], null);
      } else if (resp["data"]) {
        // this.items = resp["data"];
        this.items = resp["data"].map((value) => {
          value.startdate = value.startdate.replace(/\s/g, "T");
          value.startlocation = (this.currentLang === 'en') ? value.startlocation_en : value.startlocation_ab;
          value.endlocation = (this.currentLang === 'en') ? value.endlocation_en : value.endlocation_ab;
          value.imagepath = "http://zamilrenttruck.com/images/profiles/user_"+value.userid+"/thumb_"+value.userid+".jpeg";
          value.cost = Number(value.cost);
          value.duration = Number(value.duration);
          return value;
        });
        this.searchItems = this.items; 
        this.makeFilters();          
      }
    });            
  }

  segmentChanged(event) {
    this.clearFilters();
    if(event.value == "mytrips") {
      this.loadAvailableTrips();
      this.column = 'date';
      this.arrow = 'down';
      this.order = 1;
    } else {
      this.loadCustomTrips();
      this.column = 'date';
      this.arrow = 'down';
      this.order = 1;
    }
    console.log('segmentChanged CustomerTripsListPage');    
  }

  editTrip(trip) {
    // this.navCtrl.push(OwnerTripQuotationPage, { tripid: trip.tripid, trucktype: trip.trucktype});    
  }

  giveQuotationsForTrip(trip){
        this.navCtrl.push(OwnerTripQuotationPage, { "trip" : trip});    
  }

  updateSearch() {
    console.log('modal > updateSearch');
    if (this.search.query == '') {
      this.searchItems = this.items;
      return;
    }
    
    this.searchItems = this.items.filter((item: AppTrip) => ((item.startlocation.toLowerCase().indexOf(this.search.query.toLowerCase()) > -1) || (item.endlocation.toLowerCase().indexOf(this.search.query.toLowerCase()) > -1) || (item.trucktype.toLowerCase().indexOf(this.search.query.toLowerCase()) > -1)));
  }

  dismiss() {
    
  }

  deleteAvailableTrip(trip) {
    {
      let self = this;
      this.presentAlert(this.transObj["WANTTODELETETRIP"], [this.transObj["NO"],"Yes"], (type) => {
        if(type == 0){
          console.log("Delete Cancelled");
        } else {
          console.log("Delete executed");
          self.appService.deleteTrip(trip, (data) => {
            if(data.result == 'success') {
              const index: number = self.items.indexOf(trip);
              self.items.splice(index,1);
            } else {
              self.presentAlert(this.transObj["DELETEFAILEDTRYAGAIN"], [this.transObj["OK"]], null);
            }
          });
        }
      })
    }
  }

  createTrip() {
    this.navCtrl.push(OwnerCreateTripPage);
  }

  presentAlert(message, buttontexts, callback) {
    var buttons = [];
    var createCallback =  ( i ) => {
      return () => {
        if(callback) {
          callback(i);
        }
      }
    }
    for(var i=0; i<buttontexts.length ; i++){
      buttons.push({
        text: buttontexts[i],
        role: this.transObj["CANCEL"],
        handler: createCallback(i)
      });
    }
    let alert = this.alertCtrl.create({
      title: this.transObj["RENTATRUCK"],
      message: message,
      buttons: buttons
    });
    alert.present();
  }

  presentLoadingCustom() {
    if(!this.loading) {
      this.loading = this.loadingCtrl.create({
        duration: 10000
      });
    
      this.loading.onDidDismiss(() => {
        console.log('Dismissed loading');
      });
    
      this.loading.present();
    }
  }
  
  dismissLoading(){
    if(this.loading){
        this.loading.dismiss();
        this.loading = null;
    }
}
}
