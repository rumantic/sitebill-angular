import { Component } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FilterService } from 'app/_services/filter.service';
import {ModelService} from '../../../../_services/model.service';
import {FuseConfigService} from '../../../../../@fuse/services/config.service';
import {SitebillEntity} from '../../../../_models';

@Component({
    selector: 'front-component',
    templateUrl: './front.component.html',
    styleUrls: ['./front.component.scss'],
    animations: fuseAnimations
})
export class FrontComponent {
    public allow_load_grid = false;
    private disable_add_button: boolean = false;
    private disable_edit_button: boolean = false;
    private disable_delete_button: boolean = false;
    private disable_activation_button: boolean = false;
    private disable_gallery_controls: boolean = false;
    private disable_view_button: boolean = false;
    private sale_entity: SitebillEntity;
    private rent_entity: SitebillEntity;
    selectedTopic: any;
    topics: any;
    selectedRegion: any;
    regions: any;

    private dictiony_loaded: boolean = false;

    constructor(
        private filterService: FilterService,
        private _fuseConfigService: FuseConfigService,
        public modelService: ModelService
    ) {
        this.disable_menu();
        // console.log('lead constructor');
    }

    ngOnInit() {
        this.enable_guest_mode();

        this.sale_entity = new SitebillEntity();
        this.sale_entity.set_app_name('street');
        this.sale_entity.set_table_name('street');
        this.sale_entity.set_primary_key('street_id');
        this.sale_entity.set_disable_comment();
        this.sale_entity.set_default_params({ city_id: 3 });


        this.rent_entity = new SitebillEntity();
        this.rent_entity.set_app_name('rent');
        this.rent_entity.set_table_name('data');
        this.rent_entity.set_primary_key('id');
        this.rent_entity.set_disable_comment();
        this.rent_entity.set_default_params({ topic_id: 6122 });
    }

    enable_guest_mode () {
        this.switch_off_grid_controls();
        this.modelService.enable_guest_mode();
    }

    load_topics () {
        this.modelService.load_dictionary_model_all('data', 'topic_id')
            .subscribe((response: any) => {
                this.topics = response.data;
            });
    }

    load_regions () {
        this.modelService.load_dictionary_model_all('data', 'region_id')
            .subscribe((response: any) => {
                this.regions = response.data;
            });
    }

    ngAfterViewChecked () {
        if ( this.modelService.all_checks_passes() && !this.dictiony_loaded) {
            this.load_regions();
            this.load_topics();
            this.dictiony_loaded = true;
        }
    }

    switch_off_grid_controls () {
        this.disable_add_button = true;
        this.disable_edit_button = true;
        this.disable_delete_button = true;
        this.disable_activation_button = true;
        this.disable_gallery_controls = true;
        this.disable_view_button = false;

    }

    disable_menu() {
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: false
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
