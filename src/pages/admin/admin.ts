import { Component, ViewChild } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, Nav, Events, AlertController, LoadingController, PopoverController } from 'ionic-angular';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { AppModelServiceProvider } from '../../providers/app-model-service/app-model-service'
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImgPickerOptionsComponent } from '../../components/img-picker-options/img-picker-options';

import { TrucksListPage } from '../trucks-list/trucks-list';
import { TruckOwnersListPage } from '../truck-owners-list/truck-owners-list';
import { CustomersListPage } from '../customers-list/customers-list';
import { TripsListPage } from '../trips-list/trips-list';
import { AdminOffersListPage } from '../admin-offers-list/admin-offers-list';
import { AdminDriversListPage } from '../admin-drivers-list/admin-drivers-list';
import { CitiesPage } from '../cities/cities';
import { TruckTypesPage } from '../truck-types/truck-types';
import { AdminUpdateVatPage } from '../admin-update-vat/admin-update-vat';
import { AdminCreateUserPage } from '../admin-create-user/admin-create-user';
import { ResetPasswordPage } from "../reset-password/reset-password";


@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {
  rootPage: any = TrucksListPage;
  user: any;
  pageIndex: Number;
  isEdit: boolean;
  imgversion: any;
  private serverError: String;
  private loading: any;
  profileImgPath: any;
  profileImage: any;
  isWeb: boolean;
  imageData: any;
  phonenumber: string;
  transObj: any;

  @ViewChild(Nav) nav: Nav;
  constructor(private popoverCtrl: PopoverController, private camera: Camera, private imagePicker: ImagePicker, public loadingCtrl: LoadingController, private alertCtrl: AlertController, private platform: Platform, public appService: AppModelServiceProvider, public events: Events, translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {
    translate.getTranslation(translate.currentLang).subscribe((value)=>{
      this.transObj = value;
    });
    this.imgversion = 1.0;
    this.isEdit = false;
    this.pageIndex = 2;
    this.user = this.appService.currentUser;
    this.phonenumber = this.user.phonenumber;
    this.serverError = "";
    if (this.platform.is('core') || this.platform.is('mobileweb')) {
      this.isWeb = true;
    } else {
      this.isWeb = false;
    }
    this.getProfileImage();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');
  }


  editClicked() {
    this.isEdit = true;
  }

  saveClicked() {
    this.saveChanges();
    this.isEdit = false;
  }

  getProfileImage() {
    var imgPath = "user_" + this.user.userid + "/thumb_" + this.user.userid + ".jpeg";
    this.profileImgPath = "http://zamilrenttruck.com/images/profiles/" + imgPath + "?v=" + this.imgversion;
    this.imgversion++;
  }


  checkActivated(page) {
    return (page == this.pageIndex);
  }

  go_to_TrucksListPage(Page) {
    this.pageIndex = 1;
    this.nav.setRoot(TrucksListPage);
  }

  go_to_TruckOwnersListPage() {
    this.pageIndex = 2;
    this.nav.setRoot(TruckOwnersListPage);
  }

  go_to_CustomersListPage() {
    this.pageIndex = 3;
    this.nav.setRoot(CustomersListPage);
  }

  go_to_TripsListPage() {
    this.pageIndex = 4;
    this.nav.setRoot(TripsListPage);
  }

  go_to_OfferslistPage() {
    this.pageIndex = 5;
    this.nav.setRoot(AdminOffersListPage);
  }
  go_to_DriverslistPage() {
    this.pageIndex = 6;
    this.nav.setRoot(AdminDriversListPage);
  }

  go_to_Cities() {
    this.pageIndex = 7;
    this.nav.setRoot(CitiesPage);
  }
  go_to_TruckTypes() {
    this.pageIndex = 8;
    this.nav.setRoot(TruckTypesPage);
  }
  go_to_UpdateVAT() {
    this.pageIndex = 9;
    this.nav.setRoot(AdminUpdateVatPage);
  }

  go_to_CreateUser() {
    this.pageIndex = 10;
    this.nav.setRoot(AdminCreateUserPage);
  }
  go_to_ResetPassWord(){
    this.pageIndex=11;
    this.nav.setRoot(ResetPasswordPage);
  }

  logout_go_to_App() {
    this.pageIndex = 12;
    console.log("logout_go_to_App");
    this.events.publish('logout', 'logout');
  }



  fileUpload(event) {
    let fd = new FormData();
    fd.append('file', event.srcElement.files[0]);
    // this.data.emit(fd);
    var reader = new FileReader();
    reader.readAsDataURL(event.srcElement.files[0]);
    reader.onload = () => {
      console.log(reader.result);
      //  let base64Image = 'data:image/jpeg;base64,' + reader.result;
      var base64result = reader.result.substr(reader.result.indexOf(',') + 1);
      this.imageData = base64result;
      this.profileImage = reader.result;
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  addImage() {

    if (this.isWeb) {
      this.pickImage();
      // this.fileInput.nativeElement.click();
      setTimeout(function () {
        let element: HTMLElement = document.getElementsByClassName('cordova-camera-select')[0] as HTMLElement;
        element.click();
      }, 700);
    } else {

      let popover = this.popoverCtrl.create(ImgPickerOptionsComponent,
        {
          callback: (_data) => {
            console.log(JSON.stringify(_data + " - " + this))
            if (_data == 1) {
              this.pickImage();
            } else if (_data == 2) {
              this.pickFromCamera();
            } else {
              this.pickImage();
            }
          }
        });
      popover.present({
        ev: event
      });

    }
  }

  pickImage() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      targetWidth: 300,
      targetHeight: 300
    }

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.imageData = imageData;
      this.profileImage = base64Image;
    }, (err) => {
      // Handle error
    });
  }

  pickFromCamera() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      targetWidth: 300,
      targetHeight: 300
    }

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.imageData = imageData;
      this.profileImage = base64Image;
    }, (err) => {
    });
  }


  navigateToLoginPage() {
    this.navCtrl.pop();
  }

  focusFunction() {
    console.log("onFocus");
    this.serverError = "";
  }

  saveChanges() {

    this.presentLoadingCustom();
    this.appService.updateprofile({ userid: this.user.userid, phonenumber: this.phonenumber, imagedata: this.imageData },
      (response) => {
        if (response.result == 'success') {
          this.user.phonenumber = this.phonenumber;
          this.getProfileImage();
          this.presentAlert(this.transObj["PROFILEUPDATESUCCESS"], [this.transObj["OK"]], null);
        } else {
          //  this.serverError = response.error;
          this.presentAlert(response.error, [this.transObj["OK"]], null);
        }
        this.dismissLoading();
      });

  }

  presentAlert(message, buttontexts, callback) {
    var buttons = [];
    var createCallback = (i) => {
      return () => {
        if (callback) {
          callback(i);
        }
      }
    }
    for (var i = 0; i < buttontexts.length; i++) {
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


  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: this.transObj["RENTATRUCK"],
      message: this.transObj["REGSUCCESS"],
      buttons: [
        {
          text: this.transObj["LOGIN"],
          role: this.transObj["CANCEL"],
          handler: () => {
            console.log('Login alert clicked');
            // this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }

  presentLoadingCustom() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        duration: 10000
      });

      this.loading.onDidDismiss(() => {
        console.log('Dismissed loading');
      });

      this.loading.present();
    }
  }

  dismissLoading() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }

}
