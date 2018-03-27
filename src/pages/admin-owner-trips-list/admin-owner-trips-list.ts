import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AppModelServiceProvider, AppTrip, AppUser } from '../../providers/app-model-service/app-model-service'
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-admin-owner-trips-list',
  templateUrl: 'admin-owner-trips-list.html',
})
export class AdminOwnerTripsListPage {
  items: AppTrip[];
  segment: string;
  search: any;
  searchItems: AppTrip[];
  private loading: any;
  user: AppUser;
  transObj: any;
  
  constructor(translate: TranslateService, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.segment = 'availabletrips';
    this.search = {
      query: ''
    };
    this.user = this.navParams.get("user");
    translate.getTranslation(translate.currentLang).subscribe((value)=>{
      this.transObj = value;
    });
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad OwnerTripsListPage');
    this.getTripsForId(this.user.userid);
    // if(this.segment == 'availabletrips'){
    //   this.loadAvailableTrips();      
    // }  else {
    //   this.loadCustomTrips();      
    // } 
  }

  
  getTripsForId(ownerid) {
    this.presentLoadingCustom();
    this.appService.getTripsForOwnerId(ownerid, (resp) => {
      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, [this.transObj["OK"]], null);
      } else if (resp["data"]) {
        // this.items = resp["data"];
        this.items = resp["data"].map((value) => {
          value.startdate = value.startdate.replace(/\s/g, "T");
          return value;
        });
        this.searchItems = this.items;           
      }
    });
  }

  loadAvailableTrips() {
    this.presentLoadingCustom();
    this.appService.getOwnerAvailableTrips(this.appService.currentUser.userid, (resp) => {
      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, [this.transObj["OK"]], null);
      } else if (resp["data"]) {
        // this.items = resp["data"];
        this.items = resp["data"].map((value) => {
          value.startdate = value.startdate.replace(/\s/g, "T");
          return value;
        });
        this.searchItems = this.items;           
      }
    });
  }

  loadCustomTrips() {
    this.presentLoadingCustom();
    this.appService.getCustomPendingTrips((resp) => {
      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, [this.transObj["OK"]], null);
      } else if (resp["data"]) {
        // this.items = resp["data"];
        this.items = resp["data"].map((value) => {
          value.startdate = value.startdate.replace(/\s/g, "T");
          return value;
        });
      }
    });            
  }

  // segmentChanged(event) {
  //   if(event.value == "availabletrips") {
  //     this.loadAvailableTrips();
  //   } else {
  //     this.loadCustomTrips();
  //   }
  //   console.log('segmentChanged CustomerTripsListPage');    
  // }

  editTrip(trip) {
    // this.navCtrl.push(OwnerTripQuotationPage, { tripid: trip.tripid, trucktype: trip.trucktype});    
  }

  // giveQuotationsForTrip(trip){
  //       this.navCtrl.push(OwnerTripQuotationPage, { tripid: trip.tripid, trucktype: trip.trucktype, status:trip.status});    
  // }

  updateSearch() {
    console.log('modal > updateSearch');
    if (this.search.query == '') {
      this.searchItems = this.items;
      return;
    }
    
    this.searchItems = this.items.filter((item: AppTrip) => ((item.startlocation.toLowerCase().indexOf(this.search.query.toLowerCase()) > -1) || item.endlocation.toLowerCase().indexOf(this.search.query.toLowerCase()) > -1) || (item.trucktype.toLowerCase().indexOf(this.search.query.toLowerCase()) > -1));
  }

  dismiss() {
    
  }

  // deleteAvailableTrip(trip) {
  //   {
  //     let self = this;
  //     this.presentAlert(this.transObj["WANTTODELETETRIP"], [this.transObj["NO"],"Yes"], (type) => {
  //       if(type == 0){
  //         console.log("Delete Cancelled");
  //       } else {
  //         console.log("Delete executed");
  //         self.appService.deleteTrip(trip, (data) => {
  //           if(data.result == 'success') {
  //             const index: number = self.items.indexOf(trip);
  //             self.items.splice(index,1);
  //           } else {
  //             self.presentAlert(this.transObj["DELETEFAILEDTRYAGAIN"], [this.transObj["OK"]], null);
  //           }
  //         });
  //       }
  //     })
  //   }
  // }

  // createTrip() {
  //   this.navCtrl.push(OwnerCreateTripPage);
  // }

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
