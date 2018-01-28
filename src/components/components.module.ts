import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { HomepopoverComponent } from './homepopover/homepopover';
import { TranslateModule } from '@ngx-translate/core';
import { PlacespickerComponent } from './placespicker/placespicker';
import { ImgPickerOptionsComponent } from './img-picker-options/img-picker-options';

@NgModule({
	declarations: [HomepopoverComponent,
    PlacespickerComponent,
    ImgPickerOptionsComponent],
	imports: [
		IonicModule.forRoot(HomepopoverComponent),
		TranslateModule.forRoot()
	],
	exports: [HomepopoverComponent,
    PlacespickerComponent,
    ImgPickerOptionsComponent]
})
export class ComponentsModule {}
