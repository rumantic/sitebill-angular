import { Component } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import {ActivatedRoute, ParamMap} from "@angular/router";
import {FilterService} from "../../../_services/filter.service";
import {ApiParams, SitebillEntity} from "../../../_models";
import {ModelService} from "../../../_services/model.service";
import {AppsDataService} from "./apps-data.service";

@Component({
    selector: 'apps-data-client',
    templateUrl: './apps-data.component.html',
    styleUrls: ['./apps-data.component.scss'],
    animations: fuseAnimations
})
export class AppsDataComponent {
    public memorylist_id: any;
    public default_params: ApiParams;
    public switch_trigger: boolean;

    private entity: SitebillEntity;

    constructor(
        private route: ActivatedRoute,
        public modelService: ModelService,
        public filterService: FilterService,
        public appsDataService: AppsDataService,
        ) {
        this.switch_trigger = false;
    }

    ngOnInit() {
        this.entity = new SitebillEntity();
        this.entity.set_app_name('data');
        this.entity.set_table_name('data');
        this.entity.primary_key = 'id';


        this.route.paramMap.subscribe((params: ParamMap) => {
            this.default_params = this.appsDataService.getMenuItemByTag(params.get('tag')).params;
            this.switch_trigger = !this.switch_trigger;
            this.filterService.empty_share(this.entity)
        });
    }
}
