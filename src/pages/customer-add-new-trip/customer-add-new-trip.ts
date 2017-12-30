import { Component } from '@angular/core';
import { NavController, NavParams,  ModalController, Modal, Events, PopoverController } from 'ionic-angular';
import { AppModelServiceProvider, AppTrip, AppTruck, AppTruckType } from '../../providers/app-model-service/app-model-service'
import { AutoCompleteSearchPage } from '../auto-complete-search/auto-complete-search'
import { PlacespickerComponent } from '../../components/placespicker/placespicker';

@Component({
  selector: 'page-customer-add-new-trip',
  templateUrl: 'customer-add-new-trip.html',
})
export class CustomerAddNewTripPage {

  maxdate : string;
  mindate : string;
  dropcity: string;
  pickupcity: string;
  truckid: string;
  frieght: string;
  startdate: string;
  tempTrip: any;
  trucks : AppTruckType[];
  cities: [any];

  constructor(private popoverCtrl: PopoverController, private modal: ModalController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var c = new Date(year + 1, month, day)
    this.maxdate = c.getFullYear().toString();
    this.mindate = this.getMinDate(day, month, year);
    this.tempTrip = {};
  }

  private getMinDate(day: number, month: number, year: number): string {
    return year.toString() + "-" + month.toString() + "-" + day.toString();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerAddNewTripPage');
    this.trucks = this.appService.getTruckTypes(); 
    this.cities = ["Riyadh", "Jeddah", "Mecca", "Medina", "Al-Ahsa", "Taif", "Dammam", "Buraidah", "Khobar", "Tabuk"]; 
  }

  requestQuote(){
    if(this.truckid && this.dropcity && this.pickupcity && this.frieght && this.startdate && true){
      var trucks: AppTruckType[] = this.trucks.filter((truck: AppTruckType) => truck.trucktypeid == this.truckid);
      
      this.tempTrip = {
        truckid: this.truckid,
        trucktype: trucks[0].type,
        startlocation: this.pickupcity,
        endlocation: this.dropcity,
        status: "pending",
        startdate: this.startdate,
        comments: "",
        freight: this.frieght,
        userid: this.appService.currentUser.userid,
        createddate: this.mindate,
        rating: "0",
        ispredefined: "false",
        quotationidforpredefinedtrip: "",
        remarks: "",
        cost:"",
        duration:"",
        ownerid:""
      };
        this.appService.createTripWithCustomerid(this.tempTrip);
        this.tempTrip = {};
      
      this.navCtrl.pop();
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
            this.pickupcity = _data;
          } else {
            this.dropcity = _data;
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
      dataContext: this.cities,
      autocomplete: this,
      ispopover: true,
    });
    autoCompleteModal.present();
    autoCompleteModal.onDidDismiss((data) => {
      if(type == 'pickup'){
        this.pickupcity = data ? data.description : '';
      } else {
        this.dropcity = data ? data.description : '';
      }
    });
    
  }

}
