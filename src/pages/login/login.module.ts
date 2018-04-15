import { NgModule } from '@angular/core';
import { IonicPage, IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { IonicImageLoader } from 'ionic-image-loader';

import { LoginPage } from './login';

@NgModule({
  declarations: [
    LoginPage
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    TranslateModule,
    IonicImageLoader
  ],
  entryComponents: []
})
export class LoginPageModule {}
