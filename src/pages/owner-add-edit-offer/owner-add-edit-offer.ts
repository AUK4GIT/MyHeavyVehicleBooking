import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController, Modal, PopoverController  } from 'ionic-angular';
import { AppModelServiceProvider, AppTrip, AppTruck, AppTruckType, AppOffer } from '../../providers/app-model-service/app-model-service'
import { AutoCompleteSearchPage } from '../auto-complete-search/auto-complete-search'
import { PlacespickerComponent } from '../../components/placespicker/placespicker';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';


@Component({
  selector: 'page-owner-add-edit-offer',
  templateUrl: 'owner-add-edit-offer.html',
})
export class OwnerAddEditOfferPage {

  maxdate : string;
  mindate : string;
  // trucks : AppTruckType[];
  offer: AppOffer;
  trips: AppTrip[];
  selectedTripId: string;
  private loading: any;
  isEdit: boolean;
  tripDetails: string;
  constructor(public alertCtrl :AlertController, public loadingCtrl: LoadingController, private popoverCtrl: PopoverController, public modal: ModalController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var c = new Date(year + 1, month, day)
    this.maxdate = c.getFullYear().toString();
    this.mindate = this.getMinDate(day, month, year);
    if(this.navParams.get("offer")) {
      this.offer = this.navParams.get("offer");
      this.isEdit = true;
      this.tripDetails = this.offer.fromlocation+" - "+this.offer.tolocation;
    } else {
      this.offer = new AppOffer("","","","","","","","","","","","","");
      this.isEdit = false;
    }
  }

  private getMinDate(day: number, month: number, year: number): string {
    return year.toString() + "-" + (month.toString().length==1 ? "0"+month.toString() : month.toString()) + "-" + (day.toString().length==1 ? "0"+day.toString() : day.toString());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OwnerAddEditOfferPage');
    // this.presentLoadingCustom();
    // this.appService.getTruckTypesAndPlaces((resp) => {
    //   this.dismissLoading();
    //   if (resp.result == "failure") {
    //     console.log("resp.error");
    //     this.presentAlert(resp.error, ["OK"], null);
    //   } else if (resp["data"]) {
    //     this.trucks = resp["data"]["trucktypes"];
    //     this.appService.predefinedlistofplaces = resp["data"]["places"];
    //   }
    // });   
    this.getPredefinedTripsForOwnerId(this.appService.currentUser.userid);
  }

  getPredefinedTripsForOwnerId(ownerid) {
    this.presentLoadingCustom();
    this.appService.getPredefinedTripsForOwnerId(ownerid, (resp) => {
      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, ["OK"], null);
      } else if (resp["data"]) {
        this.trips = resp["data"];
        // this.searchItems = this.items; 
        let selectedTrip = this.trips.filter((trip: AppTrip) => (trip.tripid == this.selectedTripId))[0];
          if(selectedTrip) {
            this.selectedTripId = selectedTrip.tripid;
          }
      }
    });
  }

  tripSelected($event) {
    console.log("tripSelected");
    let selectedTrip = this.trips.filter((trip: AppTrip) => (trip.tripid == this.selectedTripId))[0];
    this.offer.fromlocation = selectedTrip.startlocation;
    this.offer.tolocation = selectedTrip.endlocation;
    this.offer.price = selectedTrip.cost;
    this.offer.truckid = selectedTrip.truckid;
    this.offer.trucktype = selectedTrip.trucktype;
    this.offer.tripid = selectedTrip.tripid;
    this.offer.userid = selectedTrip.userid;
  }

  addorUpdateOffer() {
    if(this.offer.startdate && this.offer.enddate && this.offer.discount && this.offer.message && this.selectedTripId && true){
     this.presentLoadingCustom();
     this.offer.status = "pending";
      this.appService.createOffer(this.offer, (resp) => {
        this.dismissLoading();
        if (resp.result == "failure") {
          console.log("resp.error");
          this.presentAlert(resp.error, ["OK"], null);
        } else if (resp["message"]) {
          this.presentAlert(resp["message"], ["OK"], ()=>{
            this.navCtrl.pop();
          });           
        }
      });
    }
  }

  focusFunction() {  
  }

  presentPredefinedPlaces(ev, type) {
    let popover = this.popoverCtrl.create(PlacespickerComponent, {
      callback: (_data) => {
        console.log(JSON.stringify(_data+" - "+this))
        if(_data == 'others'){
          this.presentAutoComplete(type)
        } else {
          if(type == 'pickup'){
            if(_data == this.offer.tolocation && _data != ""){
              this.presentAlert("Pickup and Drop locations cannot be same.",["OK"],null);
            } else {
              this.offer.fromlocation = _data;
            }
          } else {
            if(_data == this.offer.fromlocation && _data != ""){
              this.presentAlert("Pickup and Drop locations cannot be same.",["OK"],null);
            } else {
              this.offer.tolocation = _data;
            }
          }
        }
      },
      currentSelection: 'login'
    });

    popover.present({
      ev: ev
    });
  }

  presentAutoComplete(type) {
    const autoCompleteModal: Modal = this.modal.create(AutoCompleteSearchPage, {
      autocomplete: this,
      ispopover: true,
    });
    autoCompleteModal.present();
    autoCompleteModal.onDidDismiss((data) => {
      if(type == 'pickup'){
        this.offer.fromlocation = data ? data.description : '';
      } else {
        this.offer.tolocation = data ? data.description : '';
      }
    }); 
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
        role: 'cancel',
        handler: createCallback(i)
      });
    }
    let alert = this.alertCtrl.create({
      title: 'Rent a Truck',
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
