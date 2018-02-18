import { Component, ViewChild } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, Nav, Events,AlertController, LoadingController, PopoverController  } from 'ionic-angular';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { AppModelServiceProvider } from '../../providers/app-model-service/app-model-service'
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImgPickerOptionsComponent } from '../../components/img-picker-options/img-picker-options';

import { DriverTripsListPage } from '../driver-trips-list/driver-trips-list';
import { DriverBookingsListPage } from '../driver-bookings-list/driver-bookings-list';

@IonicPage()
@Component({
  selector: 'page-driver',
  templateUrl: 'driver.html',
})
export class DriverPage {

  rootPage:any = DriverTripsListPage;
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

  @ViewChild(Nav) nav: Nav;

  constructor(private popoverCtrl: PopoverController, private camera: Camera, private imagePicker: ImagePicker, public loadingCtrl: LoadingController, private alertCtrl: AlertController, private platform: Platform, public appService: AppModelServiceProvider, public events: Events, translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {
   this.imgversion = 1.0;
    this.isEdit = false;
    this.pageIndex = 2;
    this.user = this.appService.currentUser;  
    this.phonenumber = this.user.phonenumber;  
    this.serverError = "";
      if(this.platform.is('core') || this.platform.is('mobileweb')) {
        this.isWeb = true;
      } else {
        this.isWeb = false;
      }
      this.getProfileImage();
  }

  editClicked(){
    this.isEdit = true;
  }

  saveClicked(){
    this.saveChanges();
    this.isEdit = false;
  }

  getProfileImage(){
    var imgPath = "user_"+this.user.userid+"/thumb_"+this.user.userid+".jpeg";
    this.profileImgPath = "http://zamilrenttruck.com/images/profiles/"+imgPath+"?v="+this.imgversion;
    this.imgversion++;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DriverPage');
  }

  go_to_TripsListPage(Page){
    this.nav.setRoot(DriverTripsListPage);
  }

  go_to_BookingsListPage(){
    this.nav.setRoot(DriverBookingsListPage);  
  }

  logout_go_to_App(){
    console.log("logout_go_to_App");
    this.events.publish('logout', 'logout');    
  }



  fileUpload(event) {
    let fd = new FormData();
    fd.append('file', event.srcElement.files[0]);
    // this.data.emit(fd);
    var reader = new FileReader();
   reader.readAsDataURL(event.srcElement.files[0]);
   reader.onload =  ()=> {
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

    if(this.isWeb){
      this.pickImage();
      // this.fileInput.nativeElement.click();
      setTimeout(function(){
        let element: HTMLElement = document.getElementsByClassName('cordova-camera-select')[0] as HTMLElement;
        element.click();
      },700);
    } else {

      let popover = this.popoverCtrl.create(ImgPickerOptionsComponent,
        { callback: (_data) => {
          console.log(JSON.stringify(_data+" - "+this))
          if(_data == 1){
            this.pickImage();
          } else if (_data == 2){
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
    this.appService.updateprofile({userid: this.user.userid, phonenumber: this.phonenumber, imagedata: this.imageData},
      (response) => {
       if(response.result == 'success') {
        this.user.phonenumber = this.phonenumber;
         this.getProfileImage();
        this.presentAlert("Profile updated successfully.",["OK"],null);
       } else {
        //  this.serverError = response.error;
        this.presentAlert(response.error,["OK"],null);
       }
       this.dismissLoading();
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


  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Rent a Truck',
      message: 'Registration Successful. A verification link has been sent to your mailid. Please verify the link and then login.',
      buttons: [
        {
          text: 'Login',
          role: 'cancel',
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
