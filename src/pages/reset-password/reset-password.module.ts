import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResetPasswordPage } from './reset-password';
import { TranslateModule } from '@ngx-translate/core';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    ResetPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(ResetPasswordPage),
    TranslateModule,
    IonicImageLoader
  ],
})
export class ResetPasswordPageModule {}
