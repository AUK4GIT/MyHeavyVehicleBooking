import { Component } from '@angular/core';

/**
 * Generated class for the AboutUsEnglishComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'about-us-english',
  templateUrl: 'about-us-english.html'
})
export class AboutUsEnglishComponent {

  segment: string;
  constructor() {
    console.log('Hello AboutUsEnglishComponent Component');
    this.segment = 'aboutus';
  }

  segmentChanged() {
  }

}
