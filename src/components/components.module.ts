import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { HomepopoverComponent } from './homepopover/homepopover';
import { TranslateModule } from '@ngx-translate/core';
import { PlacespickerComponent } from './placespicker/placespicker';
import { ImgPickerOptionsComponent } from './img-picker-options/img-picker-options';
import { AboutUsEnglishComponent } from './about-us-english/about-us-english';
import { AboutUsArabicComponent } from './about-us-arabic/about-us-arabic';

@NgModule({
	declarations: [HomepopoverComponent,
    PlacespickerComponent,
    ImgPickerOptionsComponent,
    AboutUsEnglishComponent,
    AboutUsArabicComponent],
	imports: [
		IonicModule.forRoot(HomepopoverComponent),
		TranslateModule.forRoot()
	],
	exports: [HomepopoverComponent,
    PlacespickerComponent,
    ImgPickerOptionsComponent,
    AboutUsEnglishComponent,
    AboutUsArabicComponent]
})
export class ComponentsModule {}
