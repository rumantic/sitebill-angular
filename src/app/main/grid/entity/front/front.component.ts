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
    private flat_entity: SitebillEntity;
    private house_entity: SitebillEntity;
    private commerce_entity: SitebillEntity;
    private land_entity: SitebillEntity;
    private parking_entity: SitebillEntity;

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

        this.flat_entity = new SitebillEntity();
        this.flat_entity.set_app_name('sale');
        this.flat_entity.set_table_name('data');
        this.flat_entity.set_primary_key('id');
        this.flat_entity.set_disable_comment();
        // this.sale_entity.set_default_params({ city_id: 3 });
        const default_columns_list_flat = ['address_composed', 'topic_id', 'room_count', 'floor', 'floor_count', 'square_composed', 'price', 'owner_phone', 'date_added'];
        this.flat_entity.set_default_columns_list(default_columns_list_flat);



        this.house_entity = new SitebillEntity();
        this.house_entity.set_app_name('rent');
        this.house_entity.set_table_name('data');
        this.house_entity.set_primary_key('id');
        this.house_entity.set_disable_comment();
        const default_columns_list_house = ['address_composed', 'topic_id', 'room_count', 'floor', 'floor_count', 'square_composed', 'price', 'owner_phone', 'date_added'];
        this.house_entity.set_default_columns_list(default_columns_list_house);
        // this.rent_entity.set_default_params({ topic_id: 6122 });

        this.commerce_entity = new SitebillEntity();
        this.commerce_entity.set_app_name('rent');
        this.commerce_entity.set_table_name('data');
        this.commerce_entity.set_primary_key('id');
        this.commerce_entity.set_disable_comment();
        const default_columns_list_commerce = ['address_composed', 'topic_id', 'room_count', 'floor', 'floor_count', 'square_composed', 'price', 'owner_phone', 'date_added'];
        this.commerce_entity.set_default_columns_list(default_columns_list_commerce);

        this.land_entity = new SitebillEntity();
        this.land_entity.set_app_name('rent');
        this.land_entity.set_table_name('data');
        this.land_entity.set_primary_key('id');
        this.land_entity.set_disable_comment();
        const default_columns_list_land = ['address_composed', 'topic_id', 'room_count', 'floor', 'floor_count', 'square_composed', 'price', 'owner_phone', 'date_added'];
        this.land_entity.set_default_columns_list(default_columns_list_land);

        this.parking_entity = new SitebillEntity();
        this.parking_entity.set_app_name('rent');
        this.parking_entity.set_table_name('data');
        this.parking_entity.set_primary_key('id');
        this.parking_entity.set_disable_comment();
        const default_columns_list_parking = ['address_composed', 'topic_id', 'room_count', 'floor', 'floor_count', 'square_composed', 'price', 'owner_phone', 'date_added'];
        this.parking_entity.set_default_columns_list(default_columns_list_parking);
        

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
