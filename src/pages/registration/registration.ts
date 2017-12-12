import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Storage } from '@ionic/storage';
import { AppModelServiceProvider } from '../../providers/app-model-service/app-model-service'

@IonicPage()
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})
export class RegistrationPage {

  registrationForm;
  private serverError: String;
  constructor(private alertCtrl: AlertController, private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
    this.serverError = "";
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
  
      // this.registrationForm.controls['username'].setValue("test@gmail.com");
      // this.registrationForm.controls['password'].setValue("12345");
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

      this.appService.registrationService({email: loginItem.email, password: loginItem.password, name: loginItem.username, phonenumber: loginItem.phonenumber, role: loginItem.role},
        (response) => {
         if(response.result == 'success') {
          this.presentConfirm();
         } else {
           this.serverError = response.error;
         }
     });
      // this.storage.set('login', 'success');
      // this.viewCtrl.dismiss({ result: 'success', userType: 'user' });
    }

    presentConfirm() {
      let alert = this.alertCtrl.create({
        title: 'Rent a Truck',
        message: 'Registration Successful. A verfication link has been sent to your mailid. Please verify the link and then login.',
        buttons: [
          {
            text: 'Login',
            role: 'cancel',
            handler: () => {
              console.log('Login alert clicked');
              this.navCtrl.pop();
            }
          }
        ]
      });
      alert.present();
    }

}
