import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { AppModelServiceProvider } from '../../providers/app-model-service/app-model-service'
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {

  resetPWDForm;
  private serverError: String;
  private loading: any;
  transObj: any;
  
  constructor(private alertCtrl: AlertController, public loadingCtrl: LoadingController, private appService: AppModelServiceProvider, translate: TranslateService, public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams) {
    // translate.setDefaultLang('ar-sa');
    this.serverError = "";
    translate.getTranslation(translate.currentLang).subscribe((value)=>{
      this.transObj = value;
    });
  }

  ngOnInit() {
    this.resetPWDForm = new FormGroup({
      username: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )])),
      currentpassword: new FormControl('', Validators.compose([Validators.required])),
      newpassword: new FormControl('', Validators.compose([Validators.required])),
      confirmpassword: new FormControl('', Validators.compose([Validators.required]))
    }, { validators: [this.passwordMatchValidator]});
  }

  passwordMatchValidator = function(g: FormGroup) {
    return g.get('newpassword').value === g.get('confirmpassword').value
       ? null : {'error': "PME"};
 }

  ionViewDidLoad() {
  }

  closeView() {
    this.navCtrl.pop();              
  }

  focusFunction() {
    this.serverError = "";
  }

  onReset(loginItem) {
    console.log("onLogin: " + JSON.stringify(loginItem));
    if(loginItem.username == "" || loginItem.password == "") {
      return;
    }
    this.presentLoadingCustom();
    this.appService.resetPwdService({email: loginItem.username, oldpassword: loginItem.currentpassword, newpassword: loginItem.newpassword},
       (response) => {
        if(response.result == 'success') {
          this.presentAlert(this.transObj["PWDRESETSUCCESS"],[this.transObj["OK"]],()=>{
            this.navCtrl.pop();
          });
        } else {
          this.serverError = response.error;
        }
        this.dismissLoading();
    });
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

}