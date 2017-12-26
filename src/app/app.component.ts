import { Component, ViewChild } from '@angular/core';
import { Platform, Events, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { HomePage } from '../pages/home/home';
// import { FCM } from '@ionic-native/fcm';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('appNav') appNav: NavController;
  rootPage:any = HomePage;
  platform: Platform;
  translate: TranslateService;

  // constructor(private fcm: FCM, translate: TranslateService, public events: Events, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    constructor(translate: TranslateService, public events: Events, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
      
   platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.platform = platform;
      this.translate = translate;
      // translate.setDefaultLang('ar-sa');
      // this.platform.setDir('rtl', true);
      translate.setDefaultLang('en');
      this.platform.setDir('ltr', true);
    });

    events.subscribe('language:changed', (lang) => {    
      this.onLanguageChanged(lang);
    });

    events.subscribe('logout', (param) => { 
      this.appNav.setRoot(HomePage).then(() =>{
    });
    });

    // fcm.subscribeToTopic('alerts');

    // fcm.getToken().then(token=>{
    //   // backend.registerToken(token);
    // })

    // fcm.onNotification().subscribe(data=>{
    //   if(data.wasTapped){
    //    console.log("Received in background");
    //   } else {
    //    console.log("Received in foreground");
    //   };
    // })

    // fcm.onTokenRefresh().subscribe(token=>{
    //   // backend.registerToken(token);
    // })

    // fcm.unsubscribeFromTopic('marketing');

  }
  
  onLanguageChanged(lang) {
    console.log("onLanguageChanged: "+lang);
    
    if(lang == 'english'){
      this.translate.use('en')
      this.platform.setDir('ltr', true);
    } else {
      this.translate.use('ar-sa')
      this.platform.setDir('rtl', true);
    }
    
  }
}

