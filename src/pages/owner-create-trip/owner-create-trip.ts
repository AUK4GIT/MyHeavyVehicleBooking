import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, Modal, PopoverController, AlertController } from 'ionic-angular';
import { AppModelServiceProvider, AppTrip, AppTruck, AppTruckType } from '../../providers/app-model-service/app-model-service'
import { AutoCompleteSearchPage } from '../auto-complete-search/auto-complete-search'
import { PlacespickerComponent } from '../../components/placespicker/placespicker';
import { TranslateService } from '@ngx-translate/core';

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
  private loading: any;
  transObj: any;
  
  constructor(translate: TranslateService, public alertCtrl :AlertController, public loadingCtrl: LoadingController, private popoverCtrl: PopoverController, public modal: ModalController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var c = new Date(year + 1, month, day)
    this.maxdate = c.getFullYear().toString();
    this.mindate = this.getMinDate(day, month+1, year);
    translate.getTranslation(translate.currentLang).subscribe((value)=>{
      this.transObj = value;
    });
  }
  private getMinDate(day: number, month: number, year: number): string {
    return year.toString() + "-" + (month.toString().length==1 ? "0"+month.toString() : month.toString()) + "-" + (day.toString().length==1 ? "0"+day.toString() : day.toString());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OwnerCreateTripPage');
    // this.trucks = this.appService.getTruckTypes(); 
    this.presentLoadingCustom(); 
    this.appService.getTruckTypesAndPlaces((resp) => {
      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, [this.transObj["OK"]], null);
      } else if (resp["data"]) {
        this.trucks = resp["data"]["trucktypes"];
        this.appService.predefinedlistofplaces = resp["data"]["places"];
      }
    });
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
        qidpdefinedtrip: "",
        cost:this.cost,
        duration:this.duration,
        ownerid:this.appService.currentUser.userid,
        ownername:this.appService.currentUser.name
      };
      this.presentLoadingCustom();
      this.appService.createTripWithOwnerid(tempTrip, (resp)=>{
        this.dismissLoading();
        if (resp.result == "failure") {
          console.log("resp.error");
          this.presentAlert(resp.error, [this.transObj["OK"]], null);
        } else if (resp["message"]) {
          this.presentAlert(this.transObj["TRIPCREATESUCCESS"],[this.transObj["OK"]],()=>{
            this.navCtrl.pop();
          });
        }
      });
    } else {
      this.presentAlert(this.transObj["FILLALLDETAILS"],[this.transObj["OK"]],null);
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
            if(_data == this.dropcity && _data != ""){
              this.presentAlert(this.transObj["PICKDROPSAME"],[this.transObj["OK"]],null);
            } else {
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
