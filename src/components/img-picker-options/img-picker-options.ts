import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular'

@Component({
  selector: 'img-picker-options',
  templateUrl: 'img-picker-options.html'
})
export class ImgPickerOptionsComponent {

  callback: any;

  constructor(private viewCtrl: ViewController, private navParams: NavParams) {
    console.log('Hello ImgPickerOptionsComponent Component');
    this.callback = this.navParams.get('callback');
  }

  action(index){
    this.viewCtrl.dismiss();
    switch (index) {
      case 1: {
        this.callback(1);
        break;
      }
      case 2: {
        this.callback(2);
        break;
      }
      default: {
        this.callback(1);
        break;
      }
    }
  }

}
