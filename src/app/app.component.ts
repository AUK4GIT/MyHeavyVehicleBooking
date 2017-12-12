import { Component, ViewChild } from '@angular/core';
import { Platform, Events, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('appNav') appNav: NavController;
  rootPage:any = HomePage;
  platform: Platform;
  translate: TranslateService;

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
      console.log("logout: "+" ... "+this.rootPage+" - "+this.appNav.getActive()); 
      this.appNav.setRoot(HomePage);
    });
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

