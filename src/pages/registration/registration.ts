import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, AlertController, LoadingController, PopoverController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { AppModelServiceProvider } from '../../providers/app-model-service/app-model-service'
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImgPickerOptionsComponent } from '../../components/img-picker-options/img-picker-options';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})
export class RegistrationPage {

  registrationForm;
  private serverError: String;
  private loading: any;
  profileImage: any;
  isWeb: boolean;
  imageData: any;
  transObj: any;

  constructor(translate: TranslateService, private platform: Platform, private popoverCtrl: PopoverController, private camera: Camera, private imagePicker: ImagePicker, public loadingCtrl: LoadingController, private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.serverError = "";
    // if (this.platform.is('cordova') == false) {
      if(this.platform.is('core') || this.platform.is('mobileweb')) {
        this.isWeb = true;
      } else {
        this.isWeb = false;
      }
      translate.getTranslation(translate.currentLang).subscribe((value)=>{
        this.transObj = value;
      });
  }  
  
    ngOnInit() {
      this.registrationForm = new FormGroup({
        username: new FormControl('', Validators.compose([Validators.required])),
        password: new FormControl('', Validators.compose([Validators.required])),
        email: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )])),
        phonenumber: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])),
        role: new FormControl('', Validators.compose([Validators.required]))
      });
    }
  
    ionViewDidLoad() {
      console.log('ionViewDidLoad RegistrationPage');
  this.profileImage = "assets/imgs/logo.png";
      // this.registrationForm.controls['username'].setValue("test@gmail.com");
      // this.registrationForm.controls['password'].setValue("12345");
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
  
    onRegistration(loginItem) {
      console.log("onRegistration: " + JSON.stringify(loginItem)+" - "+loginItem.role);

      if(loginItem.username == "" || loginItem.password == "" || loginItem.phonenumber == "" || loginItem.email == "") {
        return;
      }
      if(this.imageData == "" || this.imageData == null){
        this.presentAlert(this.transObj["UPLOADPROFILEPIC"],[this.transObj["OK"]],null);
        return;
      }
      this.presentLoadingCustom();
      this.appService.registrationService({email: loginItem.email, password: loginItem.password, name: loginItem.username, phonenumber: loginItem.phonenumber, role: loginItem.role, status: "pending", imagedata: this.imageData},
        (response) => {
         if(response.result == 'success') {
          this.presentConfirm();
         } else {
          //  this.serverError = response.error;
          this.presentAlert(response.error,[this.transObj["OK"]],null);
         }
         this.dismissLoading();
     });
     
    }

    // uploadTruck(truckid) {
    //   this.presentLoadingCustom();
    //   this.appService.uploadTruckImage({truckid: truckid, imagedata: this.imageData, ownerid: this.appService.currentUser.userid},(resp)=>{
    //     if(resp.result == "failure"){
    //       console.log("resp.error");
    //     } else {
    //         this.presentConfirm(); 
    //     }
    //     this.dismissLoading();
    //   }); 
    // }
    
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
              this.navCtrl.pop();
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
