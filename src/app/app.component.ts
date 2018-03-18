import { Component, ViewChild } from '@angular/core';
import { Platform, Events, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { HomePage } from '../pages/home/home';
import { FCM } from '@ionic-native/fcm';
import { ImageLoaderConfig } from 'ionic-image-loader';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('appNav') appNav: NavController;
  rootPage: any = HomePage;
  platform: Platform;
  translate: TranslateService;

  constructor(private imageLoaderConfig: ImageLoaderConfig, private fcm: FCM, translate: TranslateService, public events: Events, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {

    platform.ready().then((source) => {
      imageLoaderConfig.setConcurrency(10);
      imageLoaderConfig.setFallbackUrl('assets/logo_transparent.jpg');
      imageLoaderConfig.enableSpinner(true);
      // this.imageLoaderConfig.enableDebugMode();
      statusBar.styleBlackTranslucent();
      statusBar.backgroundColorByHexString("#30580f");
      splashScreen.hide();
      this.platform = platform;
      this.translate = translate;
      let lang = localStorage.getItem("lang");
      if (lang == "en") {
        translate.setDefaultLang('en');
        this.platform.setDir('ltr', true);
      } else if (lang == "ar-sa") {
        translate.setDefaultLang('ar-sa');
        this.platform.setDir('rtl', true);
      } else {
        translate.setDefaultLang('ar-sa');
        this.platform.setDir('rtl', true);
      }

      console.log(source, );
      if (this.platform.is('android')) {
        localStorage.setItem("platform", "android");
        console.log("running on Android device!: ANdroid");
        this.configureFCM();
      }
      else if (this.platform.is('ios')) {
        localStorage.setItem("platform", "ios");
        console.log("running on iOS device!: iOS");
        this.configureFCM();
      }
      else if (this.platform.is('mobileweb')) {
        localStorage.setItem("platform", "mobileweb");
        console.log("running in a browser on mobile!: Mobileweb");
      } else {
        localStorage.setItem("platform", "browser");
        console.log("running in a browser on mobile!: Browser");
      }
    });

    events.subscribe('language:changed', (lang) => {
      this.onLanguageChanged(lang);
    });

    events.subscribe('logout', (param) => {
      this.appNav.setRoot(HomePage).then(() => {
      });
    });
  }

  configureFCM() {

    if (this.platform.is('cordova')) {
      this.fcm.subscribeToTopic('alerts');

      this.fcm.getToken().then(token => {
        localStorage.setItem("fcmtoken", token)
        // backend.registerToken(token);
      })

      this.fcm.onNotification().subscribe(data => {
        if (data.wasTapped) {
          console.log("Received in background");
        } else {
          console.log("Received in foreground");
        };
      })

      this.fcm.onTokenRefresh().subscribe(token => {
        localStorage.setItem("fcmtoken", token)
        // backend.registerToken(token);
      })

      // fcm.unsubscribeFromTopic('marketing');
    }
  }

  onLanguageChanged(lang) {
    console.log("onLanguageChanged: " + lang);

    if (lang == 'english') {
      this.translate.use('en')
      this.platform.setDir('ltr', true);
      localStorage.setItem("lang", "en");
    } else {
      this.translate.use('ar-sa')
      this.platform.setDir('rtl', true);
      localStorage.setItem("lang", "ar-sa");
    }

  }
}

