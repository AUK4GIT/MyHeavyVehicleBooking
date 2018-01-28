import { Component , ViewChild, EventEmitter, Output, ElementRef} from '@angular/core';
import { Platform, NavController, LoadingController, NavParams, AlertController, PopoverController } from 'ionic-angular';
import { AppModelServiceProvider, AppTruck, AppTruckType } from '../../providers/app-model-service/app-model-service'
import { TranslateService } from '@ngx-translate/core';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImgPickerOptionsComponent } from '../../components/img-picker-options/img-picker-options';

@Component({
  selector: 'page-owner-add-truck',
  templateUrl: 'owner-add-truck.html',
})
export class OwnerAddTruckPage {

  @ViewChild('fileInp') fileInput: ElementRef;
  @Output() data = new EventEmitter<FormData>();

  truckid: String;
  capacity: string;
  regnum: string;
  color:string;
  modeldate: string;
  OK: string;
  maxdate: string;
  trucks : AppTruckType[];
  private loading: any;
  truckimage: any;
  isWeb: boolean;
  imageData: any;
  constructor(private platform: Platform, private popoverCtrl: PopoverController, private camera: Camera, private imagePicker: ImagePicker, public loadingCtrl: LoadingController, private translate: TranslateService, private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    this.maxdate = this.getMaxDate(day, month, year);
    
    // if (this.platform.is('cordova') == false) {
    if(this.platform.is('core') || this.platform.is('mobileweb')) {
      this.isWeb = true;
    } else {
      this.isWeb = false;
    }

    this.translate.get('OK').subscribe(
      value => {
        this.OK = value;
      }
    )
  }

  private getMaxDate(day: number, month: number, year: number): string {
    return year.toString() + "-" + (month.toString().length==1 ? "0"+month.toString() : month.toString()) + "-" + (day.toString().length==1 ? "0"+day.toString() : day.toString());
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
    this.imageData = reader.result;        
     this.truckimage = reader.result;
   };
   reader.onerror = function (error) {
     console.log('Error: ', error);
   };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OwnerAddTruckPage');
    // this.trucks = this.appService.getTruckTypes(); 
    this.truckimage = "assets/imgs/logo.png";
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
     this.imageData = base64Image;
     this.truckimage = base64Image;
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
     this.imageData = base64Image;
     this.truckimage = base64Image;
    }, (err) => {
    });
  }

  uploadTruck(truckid) {
    this.presentLoadingCustom();
    this.appService.uploadTruckImage({truckid: truckid, imagedata: this.imageData},(resp)=>{
      if(resp.result == "failure"){
        console.log("resp.error");
      } else {
          this.presentConfirm(); 
      }
      this.dismissLoading();
    }); 
  }

  addTruck() {
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
          if(this.imageData) {
            if(resp.truckid){
              this.uploadTruck(resp.truckid);
            } else {
              this.presentConfirm(); 
            }
          } else {
            this.presentConfirm(); 
          }
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
