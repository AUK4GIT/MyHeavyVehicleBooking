import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { HomepopoverComponent } from './homepopover/homepopover';
import { TranslateModule } from '@ngx-translate/core';
import { PlacespickerComponent } from './placespicker/placespicker';

@NgModule({
	declarations: [HomepopoverComponent,
    PlacespickerComponent],
	imports: [
		IonicModule.forRoot(HomepopoverComponent),
		TranslateModule.forRoot()
	],
	exports: [HomepopoverComponent,
    PlacespickerComponent]
})
export class ComponentsModule {}
