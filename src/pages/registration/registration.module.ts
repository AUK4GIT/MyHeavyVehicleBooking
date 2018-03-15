import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistrationPage } from './registration';
import { TranslateModule } from '@ngx-translate/core';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    RegistrationPage,
  ],
  imports: [
    IonicPageModule.forChild(RegistrationPage),
    TranslateModule,
    IonicImageLoader
  ],
})
export class RegistrationPageModule {}
