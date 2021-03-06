import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, Modal, Events, PopoverController, AlertController } from 'ionic-angular';
import { AppModelServiceProvider, AppTrip, AppTruck, AppTruckType } from '../../providers/app-model-service/app-model-service'
import { AutoCompleteSearchPage } from '../auto-complete-search/auto-complete-search'
import { PlacespickerComponent } from '../../components/placespicker/placespicker';
import { SearchedTripModalPage } from "../searched-trip-modal/searched-trip-modal"
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-customer-add-new-trip',
  templateUrl: 'customer-add-new-trip.html',
})
export class CustomerAddNewTripPage {

  maxdate : string;
  mindate : string;
  dropcity: string;
  pickupcity: string;
  dropcity_en:string;
  dropcity_ab:string;
  pickupcity_en:string;
  pickupcity_ab:string;
  truckid: string;
  frieght: string;
  startdate: string;
  tempTrip: any;
  trucks : AppTruckType[];
  cities: [any];
  private loading: any;
  searchTrip: any;
  trips: any[];
  transObj: any;
  currentLang:string;

  constructor(translate: TranslateService, public events: Events, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private popoverCtrl: PopoverController, private modal: ModalController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    translate.getTranslation(translate.currentLang).subscribe((value)=>{
      this.transObj = value;
    });
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var c = new Date(year + 1, month, day)
    this.maxdate = c.getFullYear().toString();
    this.mindate = this.getMinDate(day, month+1, year);
    this.tempTrip = {};

    this.searchTrip = this.navParams.get("trip");
    this.trips = this.navParams.get("trips");
    this.currentLang = translate.currentLang;

    if(this.searchTrip != null){
      this.dropcity = this.searchTrip.endlocation;
      this.pickupcity = this.searchTrip.startlocation;
      this.frieght = this.searchTrip.freight;
      this.startdate = this.searchTrip.startdate;
    }
  }

  private getMinDate(day: number, month: number, year: number): string { 
    return year.toString() + "-" + (month.toString().length==1 ? "0"+month.toString() : month.toString()) + "-" + (day.toString().length==1 ? "0"+day.toString() : day.toString());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerAddNewTripPage');
    this.presentLoadingCustom();
    this.appService.getTruckTypes((resp) => {
      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, [this.transObj["OK"]], null);
      } else if (resp["data"]) {
        this.trucks = resp["data"];
        if(this.searchTrip){
          let trucks = this.trucks.filter((truck: any) => (truck.trucktypeid == this.searchTrip.truckid));
          if(trucks.length>0) {
            this.truckid = trucks[0].trucktypeid;
          }
        }
      }
    }); 
    this.cities = ["Riyadh", "Jeddah", "Mecca", "Medina", "Al-Ahsa", "Taif", "Dammam", "Buraidah", "Khobar", "Tabuk"]; 
  }

  requestQuote(){

    var trucks: AppTruckType[] = this.trucks.filter((truck: AppTruckType) => truck.trucktypeid == this.truckid);

    let items = this.trips.filter((item: any) => {
      console.log("item trucktype:- ",item.trucktype);
      return ((item.startlocation == this.pickupcity) && (item.endlocation == this.dropcity) && (item.trucktype == trucks[0].type));
    });

    if(items.length > 0){
      this.presentSearchRelatedTrips(items, {startlocation: this.pickupcity, endlocation: this.dropcity, trucktype: trucks[0].type});
    } else {
      this.continueRequestQuote();
    }
  }

  continueRequestQuote() {
    var trucks: AppTruckType[] = this.trucks.filter((truck: AppTruckType) => truck.trucktypeid == this.truckid);

    if(this.truckid && this.dropcity && this.pickupcity && this.frieght && this.startdate && true){
      
      this.tempTrip = {
        truckid: this.truckid,
        trucktype: trucks[0].type,
        startlocation: this.pickupcity,
        endlocation: this.dropcity,
        startlocation_en:this.pickupcity_en,
        startlocation_ab: this.pickupcity_ab,
        endlocation_en:this.dropcity_en,
        endlocation_ab:this.dropcity_ab,
        status: "pending",
        startdate: this.startdate,
        comments: "",
        freight: this.frieght,
        userid: this.appService.currentUser.userid,
        createddate: this.mindate,
        rating: "0",
        ispredefined: "false",
        qidpdefinedtrip: "",
        remarks: "",
        cost:"",
        duration:"",
        ownerid:"",

      };
      this.presentLoadingCustom();
        this.appService.createTripWithCustomerid(this.tempTrip, (resp)=>{
          this.dismissLoading();
          if (resp.result == "failure") {
            console.log("resp.error");
            this.presentAlert(resp.error, [this.transObj["OK"]], null);
          } else if (resp["message"]) {
            this.presentAlert(this.transObj["CUSTOMERTRIPCREATESUCCESS"],[this.transObj["OK"]],()=>{
              this.navCtrl.pop();
              this.tempTrip = {};
            });
          }
        });
        // this.tempTrip = {};  
    }
  }

  focusFunction() {
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

  presentSearchRelatedTrips(items, searchedTrip) {
      const stModal: Modal = this.modal.create(SearchedTripModalPage,{trips: items, searchedTrip: searchedTrip});
      stModal.present();
      stModal.onDidDismiss((data) => {
        if (data) {
          if (data.trip) {
            data.trip.startdate = this.startdate;
            data.trip.freight = this.frieght;
            this.navCtrl.popToRoot();
            this.events.publish('select:predefinedtrip', data.trip);
          } else {
            this.continueRequestQuote();
          }
        } else {
          this.continueRequestQuote();
        }
      });
  }

  presentPredefinedPlaces(ev, type) {
    let popover = this.popoverCtrl.create(PlacespickerComponent, {
      callback: (_data) => {
        console.log('In callback:',JSON.stringify(_data));
        console.log(JSON.stringify(_data+" - "+this))
        if(_data == 'others'){
          this.presentAutoComplete(type)
        } else {
          if(type == 'pickup'){
            if(_data == this.dropcity && _data != ""){
              this.presentAlert(this.transObj["PICKDROPSAME"],[this.transObj["OK"]],null);
            } else {
              console.log('Pickup city:',JSON.stringify(_data));
              this.pickupcity = _data;
            }
          } else {
            if(_data == this.pickupcity && _data != ""){
              this.presentAlert(this.transObj["PICKDROPSAME"],[this.transObj["OK"]],null);
            } else {
              this.dropcity = _data;
            }
          }
        }
      },
      currentSelection: this.transObj["LOGIN"]
    });

    popover.present({
      ev: ev
    });
  }

  presentAutoComplete(type) {
    const autoCompleteModal: Modal = this.modal.create(AutoCompleteSearchPage, {
      dataContext: this.cities,
      autocomplete: this,
      ispopover: true,
    });
    autoCompleteModal.present();
    
    autoCompleteModal.onDidDismiss((data) => {

      if(type == 'pickup'){
        this.pickupcity = (this.currentLang === 'en') ? data.structured_formatting.main_text : data.structed_formatting_secondary_text;
        this.pickupcity_en = data ? data.structured_formatting.main_text: '';
        this.pickupcity_ab = data ? data.structured_formatting.secondary_text: '';
      } else {
        this.dropcity = (this.currentLang === 'en') ? data.structured_formatting.main_text : data.structed_formatting_secondary_text;
        this.dropcity_en = data ? data.structured_formatting.main_text: '';
        this.dropcity_ab = data? data.structured_formatting.secondary_text: '';
      }
    });
    
  }

}
