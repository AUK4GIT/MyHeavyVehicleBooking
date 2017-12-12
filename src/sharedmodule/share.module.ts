import { NgModule }       from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrucksListPage } from '../pages/trucks-list/trucks-list';
import { TripsListPage } from '../pages/trips-list/trips-list';

@NgModule({
    imports: [
        IonicPageModule,    
        TranslateModule    
    ],
    declarations: [
        TrucksListPage,
        TripsListPage

    ],
    providers: [
    ],
    exports: [
        TrucksListPage,
        TripsListPage
    ]
})
export class SharedModule {}