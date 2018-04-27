import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular'
import { AppModelServiceProvider } from '../../providers/app-model-service/app-model-service'


@Component({
  selector: 'placespicker',
  templateUrl: 'placespicker.html'
})
export class PlacespickerComponent {

  itemSelected: any;
  callback: any;
  places: any[];

  constructor(private appService: AppModelServiceProvider, private viewCtrl: ViewController, private navParams: NavParams) {
    console.log('Hello PlacespickerComponent Component');
    this.callback = this.navParams.get('callback');
    this.places = this.appService.predefinedlistofplaces;
  }

  changeSelection() {
    if(this.itemSelected){
      this.viewCtrl.dismiss();
      console.log('Came to callback');
      this.callback(this.itemSelected);
    }
    console.log('Selection:', JSON.stringify(this.itemSelected));
    console.log("Selection: "+this.itemSelected);
  }

}
