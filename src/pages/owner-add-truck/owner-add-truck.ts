import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AppModelServiceProvider, AppTruck } from '../../providers/app-model-service/app-model-service'
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'page-owner-add-truck',
  templateUrl: 'owner-add-truck.html',
})
export class OwnerAddTruckPage {

  trucktype: String;
  capacity: string;
  regnum: string;

  OK: string;
  constructor(private translate: TranslateService, private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.translate.get('OK').subscribe(
      value => {
        this.OK = value;
      }
    )
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OwnerAddTruckPage');
  }

  addTruck() {
    if(this.trucktype && this.capacity && this.regnum){
      this.appService.addTruck({
        trucktype: this.trucktype,
        capacity: this.capacity,
        regnum: this.regnum,
        photos: null,
        rating: "0",
        ownerid: this.appService.currentUser.userid,
        status: 'approved'
      });
    }
    this.presentConfirm();
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
