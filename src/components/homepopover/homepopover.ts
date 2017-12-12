import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular'
// import { TranslateService, TranslatePipe } from '@ngx-translate/core';

/**
 * Generated class for the HomepopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'homepopover',
  templateUrl: 'homepopover.html'
})
export class HomepopoverComponent {

  itemSelected: any;
  callback: any;

  constructor(private viewCtrl: ViewController, private navParams: NavParams) {
    console.log('Hello HomepopoverComponent Component');
    this.callback = this.navParams.get('callback');
    // this.itemSelected = this.navParams.get('currentSelection');
  }

  changeSelection() {
    if(this.itemSelected){
      this.viewCtrl.dismiss();
      this.callback(this.itemSelected);
    }
    
    console.log("Selection: "+this.itemSelected);
  }
}
