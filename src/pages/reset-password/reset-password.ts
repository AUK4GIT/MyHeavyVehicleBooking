import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, Nav, Events,AlertController, LoadingController, PopoverController,ToastController  } from 'ionic-angular';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { AppModelServiceProvider } from '../../providers/app-model-service/app-model-service';
import { FormGroup, FormControl, Validators } from '@angular/forms'


/**
 * Generated class for the ResetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {
  
  loginForm;
  transObj: any;
  private serverError: String;
  private loading: any;

  constructor(public navCtrl: NavController,public loadingCtrl: LoadingController, private alertCtrl: AlertController, public navParams: NavParams,private toastCtrl: ToastController, translate: TranslateService,private appService: AppModelServiceProvider,) {
    console.log('Came to construct');
      this.serverError = "";
    translate.getTranslation(translate.currentLang).subscribe((value)=>{
      this.transObj = value;
    });
  }

  ngOnInit() {
    console.log('came to ng init');
    this.loginForm = new FormGroup({
      currentpassword: new FormControl('', Validators.compose([Validators.required])),
      newpassword: new FormControl('', Validators.compose([Validators.required])),
      confirmpassword:new FormControl('', Validators.compose([Validators.required]))
    });
  }

  updatePassword(loginItem) {
    console.log('came to password');
    if(loginItem.newpassword != loginItem.confirmpassword){
      alert(' New password and confirm password must be same');
    }else{
      console.log('Came to else');
      this.presentLoadingCustom();
      console.log('Going to login service');
      this.appService.resetPwdService({email:this.appService.currentUser.email,newpassword:loginItem.newpassword,oldpassword:loginItem.currentpassword},(response) => {
          console.log(response);
          if(response.result === 'success'){
            this.presentAlert(this.transObj["PASSWORDUPDATESUCCESS"],[this.transObj["OK"]],null);
          }else{
            this.presentAlert(response.error,[this.transObj["OK"]],null);
          }
          this.loginForm.reset();
          this.dismissLoading();
      });
    }
  }

  ionViewDidLoad() {
   
    console.log('ionViewDidLoad ResetPasswordPage');
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
    console.log("Message:",message);
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

