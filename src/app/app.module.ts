import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
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

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AutoCompleteSearchPage
  ],
  imports: [
    BrowserModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    AdminPageModule,
    TruckOwnerPageModule,
    DriverPageModule,
    CustomerPageModule,
    Ionic2RatingModule,
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
    PlacespickerComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AppModelServiceProvider
  ]
})
export class AppModule {}
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
