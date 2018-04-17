import { Component } from '@angular/core';

/**
 * Generated class for the AboutUsArabicComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'about-us-arabic',
  templateUrl: 'about-us-arabic.html'
})
export class AboutUsArabicComponent {

  segment: string;

  constructor() {
    console.log('Hello AboutUsArabicComponent Component');
    this.segment = 'aboutus';
  }

  segmentChanged() {
  }
}
