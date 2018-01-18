import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams, AlertController } from 'ionic-angular';
import { AppModelServiceProvider, AppTruck, AppTruckType } from '../../providers/app-model-service/app-model-service'
import { TranslateService } from '@ngx-translate/core';
import { ImagePicker } from '@ionic-native/image-picker';


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
  private loading: any;
  constructor(private imagePicker: ImagePicker, public loadingCtrl: LoadingController, private translate: TranslateService, private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
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
    return year.toString() + "-" + (month.toString().length==1 ? "0"+month.toString() : month.toString()) + "-" + (day.toString().length==1 ? "0"+day.toString() : day.toString());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OwnerAddTruckPage');
    // this.trucks = this.appService.getTruckTypes(); 
    this.presentLoadingCustom();
    this.appService.getTruckTypes((resp) => {
      this.dismissLoading();
      if (resp.result == "failure") {
        console.log("resp.error");
        this.presentAlert(resp.error, ["OK"], null);
      } else if (resp["data"]) {
        this.trucks = resp["data"];
      }
    });      
  }

  addTruck() {

    // var options = { maximumImagesCount: 10,
    //   width: 800 };
    // this.imagePicker.getPictures(options).then((results) => {
    //   for (var i = 0; i < results.length; i++) {
    //       console.log('Image URI: ' + results[i]);
    //   }
    // }, (err) => { });

  //   window.imagePicker.getPictures(
  //     function(results) {
  //         for (var i = 0; i < results.length; i++) {
  //             console.log('Image URI: ' + results[i]);
  //         }
  //     }, function (error) {
  //         console.log('Error: ' + error);
  //     }, {
  //         maximumImagesCount: 10,
  //         width: 800
  //     }
  // );
  // return;
    if(this.truckid && this.capacity && this.regnum  && this.color  && this.modeldate && true){
      this.presentLoadingCustom();
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
      },(resp)=>{
        if(resp.result == "failure"){
          console.log("resp.error");
        } else {
          this.presentConfirm(); 
        }
        this.dismissLoading();
      });     
    } else {
      this.presentAlert("Please fill all the details.",["OK"],null);
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
