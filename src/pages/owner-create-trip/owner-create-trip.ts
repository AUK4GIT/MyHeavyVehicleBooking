import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Modal, PopoverController } from 'ionic-angular';
import { AppModelServiceProvider, AppTrip, AppTruck, AppTruckType } from '../../providers/app-model-service/app-model-service'
import { AutoCompleteSearchPage } from '../auto-complete-search/auto-complete-search'
import { PlacespickerComponent } from '../../components/placespicker/placespicker';

@Component({
  selector: 'page-owner-create-trip',
  templateUrl: 'owner-create-trip.html',
})
export class OwnerCreateTripPage {

  maxdate : string;
  mindate : string;
  dropcity: string;
  pickupcity: string;
  truckid: string;
  frieght: string;
  startdate: string;
  trucks : AppTruckType[];
  cost: string;
  duration: string;

  constructor(private popoverCtrl: PopoverController, public modal: ModalController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var c = new Date(year + 1, month, day)
    this.maxdate = c.getFullYear().toString();
    this.mindate = this.getMinDate(day, month, year);
  }
  private getMinDate(day: number, month: number, year: number): string {
    return year.toString() + "-" + month.toString() + "-" + day.toString();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OwnerCreateTripPage');
    this.trucks = this.appService.getTruckTypes(); 
  }

  createTrip() {
    if(this.pickupcity && this.dropcity && this.cost && this.duration) {
      var trucktype="";
      var truckid = this.truckid ? this.truckid : "";
      if(this.truckid) {
        var trucks: AppTruckType[] = this.trucks.filter((truck: AppTruckType) => truck.trucktypeid == this.truckid);
        trucktype = trucks[0].type;
      }
      
      var tempTrip = {
        truckid: truckid ,
        trucktype: trucktype,
        startlocation: this.pickupcity,
        endlocation: this.dropcity,
        status: "pending",
        startdate: this.startdate ? this.startdate : "",
        comments: "",
        remarks: "",
        freight: this.frieght ? this.frieght : "",
        userid: this.appService.currentUser.userid,
        createddate: this.mindate ? this.mindate : "",
        rating: "0",
        ispredefined: "true",
        quotationidforpredefinedtrip: ""
      };
      this.appService.createTripWithOwnerid(tempTrip);
      this.navCtrl.pop();
    } else {

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
