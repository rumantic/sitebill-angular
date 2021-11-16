import { Component } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import {ActivatedRoute, ParamMap} from "@angular/router";
import {FilterService} from "../../../_services/filter.service";
import {SitebillEntity} from "../../../_models";

@Component({
    selector: 'apps-data-client',
    templateUrl: './apps-data.component.html',
    styleUrls: ['./apps-data.component.scss'],
    animations: fuseAnimations
})
export class AppsDataComponent {
    public memorylist_id: any;
    private entity: SitebillEntity;
    constructor(
        private route: ActivatedRoute,
        public filterService: FilterService,
        ) {
    }

    ngOnInit() {
        this.entity = new SitebillEntity();
        this.entity.set_app_name('data');
        this.entity.set_table_name('data');
        this.entity.primary_key = 'id';


        this.route.paramMap.subscribe((params: ParamMap) => {
            this.memorylist_id = params.get('memorylist_id');
            this.filterService.empty_share(this.entity);
        });
    }
}
