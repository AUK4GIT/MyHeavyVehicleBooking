import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { HomepopoverComponent } from './homepopover/homepopover';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
	declarations: [HomepopoverComponent],
	imports: [
		IonicModule.forRoot(HomepopoverComponent),
		TranslateModule.forRoot()
	],
	exports: [HomepopoverComponent]
})
export class ComponentsModule {}
