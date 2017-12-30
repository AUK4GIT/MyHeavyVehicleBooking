import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppModelServiceProvider, AppOffer } from '../../providers/app-model-service/app-model-service'
import { OwnerAddEditOfferPage } from '../owner-add-edit-offer/owner-add-edit-offer'

/**
 * Generated class for the OffersListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-offers-list',
  templateUrl: 'offers-list.html',
})
export class OffersListPage {
  items: AppOffer[];
  constructor(private appService: AppModelServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.items = this.appService.getOffers();            
    console.log('ionViewDidLoad OffersListPage');
  }

  createOffer() {
    this.navCtrl.push(OwnerAddEditOfferPage);
  }

  editOffer(offer) {
    this.navCtrl.push(OwnerAddEditOfferPage, {
      offer: offer
    });
  }

}
