import { Component, OnInit } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import {googlemaps} from 'googlemaps';

@Component({
  selector: 'page-auto-complete-search',
  templateUrl: 'auto-complete-search.html',
})
export class AutoCompleteSearchPage {


  autocompleteItems: any;
  autocomplete: any;
  acService: any;
  placesService: any;

  constructor(private viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AutoCompleteSearchPage');
  }

  ngOnInit() {
    this.acService = new google.maps.places.AutocompleteService();
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }


  chooseItem(item: any) {
    this.viewCtrl.dismiss(item);
  }

  dismiss() {
    
  }

  updateSearch() {
    console.log('modal > updateSearch');
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let self = this;
    let config = {
      types:  ['(cities)'], // other types available in the API: 'establishment', 'regions', and 'cities'
      input: this.autocomplete.query,
      componentRestrictions: {country: 'sa'}
    }
    this.acService.getPlacePredictions(config, function (predictions, status) {
      console.log('modal > getPlacePredictions > status > ', status);
      self.autocompleteItems = [];
      if(predictions) {
      predictions.forEach(function (prediction) {
        self.autocompleteItems.push(prediction);
      });
    } else {
      // this.present
      console.log("check internet connection");
    }
    });
  }


}
