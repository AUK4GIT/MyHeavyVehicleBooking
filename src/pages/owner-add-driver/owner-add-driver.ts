import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AppModelServiceProvider } from '../../providers/app-model-service/app-model-service'
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-owner-add-driver',
  templateUrl: 'owner-add-driver.html',
})
export class OwnerAddDriverPage {

  name: string;
  phonenumber: string;
  password: string;
  email: string;

  OK: string;
  APPTITLE: string;
  ADDDRIVERMESSAGE: string;

  constructor(private translate: TranslateService, private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.translate.get('OK').subscribe(
      value => {
        this.OK = value;
      }
    )
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OwnerAddDriverPage');
  }

  addDriver() {
    if(this.name && this.password && this.email && this.phonenumber){
      this.appService.addUser({
        name: this.name,
        email: this.email,
        password: this.password,
        phonenumber: this.phonenumber,
        role: "driver",
        status: "pending",
        ownerid: this.appService.currentUser.userid
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
      message: 'Driver added Successful. Pending approval from Admin.',
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
