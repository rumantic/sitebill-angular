import { Component } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FilterService } from 'app/_services/filter.service';
import {ModelService} from '../../../../_services/model.service';
import {FuseConfigService} from '../../../../../@fuse/services/config.service';

@Component({
    selector: 'front-component',
    templateUrl: './front.component.html',
    styleUrls: ['./front.component.scss'],
    animations: fuseAnimations
})
export class FrontComponent {
    public allow_load_grid = false;
    constructor(
        private filterService: FilterService,
        private _fuseConfigService: FuseConfigService,
        protected modelService: ModelService
    ) {
        this.disable_menu();
        //console.log('lead constructor');
    }

    ngOnInit() {
        this.modelService.get_session_key_safe();
    }
    disable_menu() {
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                }
            }
        };
    }



    after_validated_key () {
        return this.modelService.is_validated_session_key();
    }
    

    getMyClientCounter() {
        return this.filterService.get_counter_value('myclient', 'total_count');
    }
    getFreeClientCounter() {
        return this.filterService.get_counter_value('freeclient', 'total_count');
    }
}
