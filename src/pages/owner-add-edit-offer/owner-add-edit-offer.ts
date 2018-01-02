import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Modal, PopoverController  } from 'ionic-angular';
import { AppModelServiceProvider, AppTrip, AppTruck, AppTruckType, AppOffer } from '../../providers/app-model-service/app-model-service'
import { AutoCompleteSearchPage } from '../auto-complete-search/auto-complete-search'
import { PlacespickerComponent } from '../../components/placespicker/placespicker';


@Component({
  selector: 'page-owner-add-edit-offer',
  templateUrl: 'owner-add-edit-offer.html',
})
export class OwnerAddEditOfferPage {

  maxdate : string;
  mindate : string;
  trucks : AppTruckType[];
  offer: AppOffer;
  constructor(private popoverCtrl: PopoverController, public modal: ModalController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var c = new Date(year + 1, month, day)
    this.maxdate = c.getFullYear().toString();
    this.mindate = this.getMinDate(day, month, year);
    if(this.navParams.get("offer")) {
      this.offer = this.navParams.get("offer");
    } else {
      this.offer = new AppOffer("","","","","","","","","","","","","");
    }
  }
  private getMinDate(day: number, month: number, year: number): string {
    return year.toString() + "-" + (month.toString().length==1 ? "0"+month.toString() : month.toString()) + "-" + (day.toString().length==1 ? "0"+day.toString() : day.toString());
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad OwnerAddEditOfferPage');
    this.trucks = this.appService.getTruckTypes(); 
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
            this.offer.fromlocation = _data;
          } else {
            this.offer.tolocation = _data;
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
}
