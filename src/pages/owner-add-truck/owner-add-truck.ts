import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AppModelServiceProvider, AppTruck, AppTruckType } from '../../providers/app-model-service/app-model-service'
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'page-owner-add-truck',
  templateUrl: 'owner-add-truck.html',
})
export class OwnerAddTruckPage {

  truckid: String;
  capacity: string;
  regnum: string;
  color:string;
  modeldate: string;
  OK: string;
  maxdate: string;
  trucks : AppTruckType[];

  constructor(private translate: TranslateService, private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    this.maxdate = this.getMaxDate(day, month, year);
    
    this.translate.get('OK').subscribe(
      value => {
        this.OK = value;
      }
    )
  }

  private getMaxDate(day: number, month: number, year: number): string {
    return year.toString() + "-" + month.toString() + "-" + day.toString();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OwnerAddTruckPage');
    this.trucks = this.appService.getTruckTypes();     
  }

  addTruck() {
    if(this.truckid && this.capacity && this.regnum  && this.color  && this.modeldate && true){
      var trucks: AppTruckType[] = this.trucks.filter((truck: AppTruckType) => truck.trucktypeid == this.truckid);
      
      this.appService.addTruck({
        trucktype: trucks[0].type,
        capacity: this.capacity,
        regnum: this.regnum,
        photos: null,
        rating: "0",
        ownerid: this.appService.currentUser.userid,
        status: 'pending',
        color: this.color,
        modeldate: this.modeldate
      });
      this.presentConfirm();      
    } else {

    }
  }

  focusFunction() {
    // console.log("onFocus");
    // this.serverError = "";
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Rent a Truck',
      message: 'Truck added Successful. Pending approval from Admin.',
      buttons: [
        {
          text: this.OK,
          role: 'cancel',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }

}
