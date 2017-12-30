import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Storage } from '@ionic/storage';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { AppModelServiceProvider } from '../../providers/app-model-service/app-model-service'

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm;
  private serverError: String;
  constructor(private appService: AppModelServiceProvider, translate: TranslateService, public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
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
    this.appService.loginService({email: loginItem.username, password: loginItem.password},
       (response) => {
        if(response.result == 'success') {
          this.viewCtrl.dismiss({ result: 'success', user: response.data });          
        } else {
          this.serverError = response.error;
        }
    });
    //   // set a key/value
    // this.storage.set('name', 'Max');
  
    // // Or to get a key/value pair
    // this.storage.get('age').then((val) => {
    //   console.log('Your age is', val);
    // });
  }

}
