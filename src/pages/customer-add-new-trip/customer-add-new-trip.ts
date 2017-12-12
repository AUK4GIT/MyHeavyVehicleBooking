import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppModelServiceProvider, AppTrip } from '../../providers/app-model-service/app-model-service'

@Component({
  selector: 'page-customer-add-new-trip',
  templateUrl: 'customer-add-new-trip.html',
})
export class CustomerAddNewTripPage {

  maxdate : string;
  mindate : string;
  dropcity: string;
  pickupcity: string;
  trucktype: string;
  frieght: string;
  startdate: string;
  tempTrip: any;
  trucks : any[];
  cities: [any];

  constructor(private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
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
    this.trucks = this.appService.getTrucks(); 
    this.cities = ["Riyadh", "Jeddah", "Mecca", "Medina", "Al-Ahsa", "Taif", "Dammam", "Buraidah", "Khobar", "Tabuk"]; 
  }

  requestQuote(){
    if(this.trucktype && this.dropcity && this.pickupcity && this.frieght && this.startdate){
      
      this.tempTrip = {
        trucktype: this.trucktype,
        startlocation: this.pickupcity,
        endlocation: this.dropcity,
        status: "pending",
        startdate: this.startdate,
        comments: "",
        offers: null,
        freight: this.frieght,
        userid: this.appService.currentUser.userid,
        createddate: this.mindate
      };
        this.appService.createTripWithCustomerid(this.tempTrip);
        this.tempTrip = {};
      
      this.navCtrl.pop();
    }
  }

  focusFunction() {
  }

}
