import { Component } from '@angular/core';
import { App, LoadingController, PopoverController, NavController, ModalController, Modal, Events, AlertController } from 'ionic-angular';
import { HomepopoverComponent } from '../../components/homepopover/homepopover';
import { AppModelServiceProvider, AppTruckType, AppOffer, AppCity } from '../../providers/app-model-service/app-model-service'
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
  cities: AppCity[];
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
  private loading: any;

  constructor(public alertCtrl :AlertController, public loadingCtrl: LoadingController, private appService: AppModelServiceProvider, public appCtrl: App, public events: Events, private popoverCtrl: PopoverController, public navCtrl: NavController, private modal: ModalController) {
    this.segment = 'aboutus';
    this.bgclasses = ["truckbgone", "truckbgtwo", "truckbgthree"];
    this.cities = []; 

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
    this.mindate = this.getMinDate(day, month+1, year);
    this.tempTrip = {};
    this.hideSlide = true;
  }

  private getMinDate(day: number, month: number, year: number): string {
    return year.toString() + "-" + (month.toString().length==1 ? "0"+month.toString() : month.toString()) + "-" + (day.toString().length==1 ? "0"+day.toString() : day.toString());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad tabsparent');
    this.presentLoadingCustom();
    this.appService.getTruckTypesAndPlaces((resp) => {
      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, ["OK"], null);
      } else if (resp["data"]) {
        this.trucks = resp["data"]["trucktypes"];
        this.appService.predefinedlistofplaces = resp["data"]["places"];
      }
    });  
    this.appService.getApprovedOffers((resp)=>{
      if(resp.result == "failure"){
        console.log("resp.error");
      } else {
        this.offers = resp.data;
        if(this.offers && this.offers.length>0) {
          localStorage.setItem("offers",JSON.stringify(this.offers));
          this.hideSlide = false;
        } else {
          localStorage.setItem("offers",JSON.stringify(this.offers));
          this.hideSlide = true;
        }
      }
      this.dismissLoading();
    });
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
        qidpdefinedtrip: "",
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
    if (Object.keys(this.tempTrip).length > 0 && user.role == "customer") {
      this.tempTrip["userid"] = user.userid;
      this.appService.customTripCreated = true;
      localStorage.setItem("tripSearch","true");
      localStorage.setItem("tripSearched",JSON.stringify(this.tempTrip));

      this.navigateToRolebasedModule(user.role);
      // this.presentLoadingCustom();
      // this.appService.createTripWithCustomerid(this.tempTrip, (resp) => {
      //   this.dismissLoading();
      //   if (resp.result == "failure") {
      //     console.log("resp.error");
      //     this.presentAlert(resp.error, ["OK"], null);
      //   } else if (resp["message"]) {
      //     this.tempTrip = {};
      //     this.navigateToRolebasedModule(user.role);
      //   }
      // });
    } else {
      this.appService.customTripCreated = false;
      localStorage.setItem("tripSearch","false");
      localStorage.setItem("tripSearched",null);
      this.navigateToRolebasedModule(user.role);
      console.log("Error afterLogin");
    }
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
            if(_data == this.dropcity && _data != ""){
              this.presentAlert("Pickup and Drop locations cannot be same.",["OK"],null);
            } else {
              this.pickupcity = _data;
            }
          } else {
            if(_data == this.pickupcity && _data != ""){
              this.presentAlert("Pickup and Drop locations cannot be same.",["OK"],null);
            } else {
              this.dropcity = _data;
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
        this.afterLogin(data.user[0]);
      } else {
        console.log("Login Failure: ", JSON.stringify(data));
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
