import { Component, ViewChild } from '@angular/core';
import { Slides, App, PopoverController, NavParams, NavController, ModalController, Modal, Events } from 'ionic-angular';
import { HomepopoverComponent } from '../../components/homepopover/homepopover';
import { AppModelServiceProvider, AppTrip, AppTruckType, AppOffer } from '../../providers/app-model-service/app-model-service'
import { Popover } from 'ionic-angular/components/popover/popover';
import { AutoCompleteSearchPage } from '../auto-complete-search/auto-complete-search'
import { PlacespickerComponent } from '../../components/placespicker/placespicker';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
// @ViewChild(Slides) slider: Slides;

  segment: string;
  trucks : AppTruckType[];
  cities: [any];
  bgclass: any;
  bgclasses: [string];
  maxdate : string;
  mindate : string;
  dropcity: string;
  pickupcity: string;
  truckid: string;
  frieght: string;
  startdate: string;
  tempTrip: any;
  offers: AppOffer[];
  hideSlide: boolean;

  constructor(private appService: AppModelServiceProvider, public appCtrl: App, public events: Events, private popoverCtrl: PopoverController, public navCtrl: NavController, private modal: ModalController) {
    this.segment = 'aboutus';
    this.bgclasses = ["truckbgone", "truckbgtwo", "truckbgthree"];
    // this.bgclass = this.bgclasses[0];
    this.bgclass = { 'truckbgone': true, 'truckbgtwo': false, 'truckbgthree': false };
    var i = 0;
    setInterval(() => { this.bgclass = { 'truckbgone': (i%3 == 0), 'truckbgtwo': (i%3 == 1), 'truckbgthree': (i%3 == 2) }; i++}, 2000);
   
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var c = new Date(year + 1, month, day)
    this.maxdate = c.getFullYear().toString();
    this.mindate = this.getMinDate(day, month, year);
    this.tempTrip = {};
    this.hideSlide = true;
  }

  private getMinDate(day: number, month: number, year: number): string {
    return year.toString() + "-" + month.toString() + "-" + day.toString();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad tabsparent');
    this.trucks = this.appService.getTruckTypes(); 
    this.cities = ["Riyadh", "Jeddah", "Mecca", "Medina", "Al-Ahsa", "Taif", "Dammam", "Buraidah", "Khobar", "Tabuk"]; 
    this.offers = this.appService.getOffers();
    if(this.offers && this.offers.length>0) {
      this.hideSlide = false;
    } else {
      this.hideSlide = true;
    }
  }

  dismiss() {
  }

  requestQuote(){
    if(this.truckid && this.dropcity && this.pickupcity && this.frieght && this.startdate && true){
      var trucks: AppTruckType[] = this.trucks.filter((truck: AppTruckType) => truck.trucktypeid == this.truckid);
       
      this.tempTrip = {
        trucktype: trucks[0].type,
        truckid: this.truckid,
        startlocation: this.pickupcity,
        endlocation: this.dropcity,
        status: "pending",
        startdate: this.startdate,
        comments: "",
        freight: this.frieght,
        userid: "",
        createddate: this.mindate,
        rating: "0",
        ispredefined: "false",
        quotationidforpredefinedtrip: "",
        remarks: "",
        cost:"",
        duration:"",
        ownerid:""
      };
      this.presentLoginView();
    } else {
      console.log("fail");
    }
  }

    navigateToRolebasedModule(role) {
      switch(role){
        case 'admin': {
          this.appCtrl.getRootNav().setRoot("AdminPage");  
          // this.appCtrl.getRootNav().push("AdminPage");                         
          
          break;
        } 
        case 'owner': {
          this.appCtrl.getRootNav().setRoot("TruckOwnerPage");  
          // this.appCtrl.getRootNav().push("TruckOwnerPage");                         
          
          break;
        } 
        case 'driver': {
          this.appCtrl.getRootNav().setRoot("DriverPage");  
          // this.appCtrl.getRootNav().push("DriverPage");                         
          
          break;
        } 
        case 'customer': {
          this.appCtrl.getRootNav().setRoot("CustomerPage");  
          // this.appCtrl.getRootNav().push("CustomerPage");                         
          
          break;
        } 
        default: { 
          //statements; 
          break; 
       } 
      }
    }

  afterLogin(user) {
    this.appService.setCurrentUser(user);
    if(Object.keys(this.tempTrip).length > 0){
      this.tempTrip["userid"] = user.userid;
      this.appService.createTripWithCustomerid(this.tempTrip);
      this.tempTrip = {};
    } else {

    }
    this.navigateToRolebasedModule(user.role);    
  }

  focusFunction() {
  }

  segmentChanged() {
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

  presentPopover(ev) {

    let popover = this.popoverCtrl.create(HomepopoverComponent, {
      callback: (_data) => {
        console.log(JSON.stringify(_data+" - "+this))
        if(_data == 'login'){
          this.presentLoginView();
        } else if (_data == 'english'){
          this.events.publish('language:changed', 'english');
        } else if (_data == 'arabic'){
          this.events.publish('language:changed', 'arabic');
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

  presentLoginView() {
    const loginModal: Modal = this.modal.create('LoginPage');
    loginModal.present();
    loginModal.onDidDismiss((data) => {
      if (data && data.result == 'success') {
        this.afterLogin(data.user);
      } else {
        console.log("Login Failure: ", JSON.stringify(data));
      }
    });
    
  }
}
