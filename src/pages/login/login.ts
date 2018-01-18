import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Storage } from '@ionic/storage';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { AppModelServiceProvider } from '../../providers/app-model-service/app-model-service'
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm;
  private serverError: String;
  private loading: any;
  constructor(private alertCtrl: AlertController, public loadingCtrl: LoadingController, private appService: AppModelServiceProvider, translate: TranslateService, public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
    // translate.setDefaultLang('ar-sa');
    this.serverError = "";
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )])),
      password: new FormControl('', Validators.compose([Validators.required]))
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

    // this.loginForm.controls['username'].setValue("test@gmail.com");
    // this.loginForm.controls['password'].setValue("12345");
  }

  forgotPassword() {
    let prompt = this.alertCtrl.create({
      title: 'Rent A Truck',
      message: "Enter your EmailId to receive the password.",
      inputs: [
        {
          name: 'EmailId',
          placeholder: 'Email id'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: data => {
            console.log('Saved clicked: '+data.EmailId);
            this.presentLoadingCustom();
            this.appService.sendForgotPassword(data.EmailId, (resp)=>{
              this.dismissLoading();
              if(resp.result == "failure"){
                console.log("resp.error");
                this.presentAlert(resp.error,["OK"],null);
              } else {
                this.presentAlert(resp.message,["OK"],null);
              }
            });
          }
        }
      ]
    });
    prompt.present();
  }

  loginWithRole(role) {
    switch(role){
      case 1: {
        this.loginForm.controls['username'].setValue("admin1@gmail.com");
        this.loginForm.controls['password'].setValue("admin");
        break;
      }
      case 2: {
        this.loginForm.controls['username'].setValue("owner1@gmail.com");
        this.loginForm.controls['password'].setValue("owner");
        break;
      }
      case 3: {
        this.loginForm.controls['username'].setValue("customer1@gmail.com");
        this.loginForm.controls['password'].setValue("customer");
        break;
      }
      case 4: {
        this.loginForm.controls['username'].setValue("driver1@gmail.com");
        this.loginForm.controls['password'].setValue("driver");
        break;
      }
      default: {
        break;
      }
    }
    // this.closeLogin();
  }

  closeLogin() {
    this.viewCtrl.dismiss();              
  }

  navigateToRegistrationPage() {
    this.navCtrl.push("RegistrationPage");
  }

  focusFunction() {
    this.serverError = "";
  }

  onLogin(loginItem) {
    console.log("onLogin: " + JSON.stringify(loginItem));
    if(loginItem.username == "" || loginItem.password == "") {
      return;
    }
    this.presentLoadingCustom();
    this.appService.loginService({email: loginItem.username, password: loginItem.password},
       (response) => {
        if(response.result == 'success') {
          this.viewCtrl.dismiss({ result: 'success', user: response.data });          
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
}
