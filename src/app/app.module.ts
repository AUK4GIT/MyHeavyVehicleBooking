import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicPage, IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
// import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { FCM } from '@ionic-native/fcm';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ComponentsModule } from '../components/components.module';
import { AdminPageModule } from '../pages/admin/admin.module';
import { TruckOwnerPageModule } from '../pages/truck-owner/truck-owner.module';
import { DriverPageModule } from '../pages/driver/driver.module';
import { CustomerPageModule } from '../pages/customer/customer.module'
import { Ionic2RatingModule } from 'ionic2-rating';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { HomepopoverComponent } from '../components/homepopover/homepopover';
import { AppModelServiceProvider } from '../providers/app-model-service/app-model-service';
import { AutoCompleteSearchPage } from '../pages/auto-complete-search/auto-complete-search'
import { PlacespickerComponent } from '../components/placespicker/placespicker';
import { AboutUsEnglishComponent } from '../components/about-us-english/about-us-english'
import { AboutUsArabicComponent } from '../components/about-us-arabic/about-us-arabic'

import {ImgPickerOptionsComponent } from '../components/img-picker-options/img-picker-options'
import { IonicImageLoader } from 'ionic-image-loader';
import { ResetPasswordPage } from '../pages/reset-password/reset-password'; 



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AutoCompleteSearchPage,
    ResetPasswordPage

      ],
  imports: [
    BrowserModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    AdminPageModule,
    TruckOwnerPageModule,
    DriverPageModule,
    CustomerPageModule,
    Ionic2RatingModule,
    IonicImageLoader.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    HomepopoverComponent,
    AutoCompleteSearchPage,
    PlacespickerComponent,
    ImgPickerOptionsComponent,
    ResetPasswordPage,
    AboutUsEnglishComponent,
    AboutUsArabicComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FCM,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AppModelServiceProvider
  ]
})
export class AppModule {}
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
