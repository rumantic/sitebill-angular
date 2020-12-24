import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

import { fuseAnimations } from '@fuse/animations';


import {Observable, Subject} from 'rxjs';
import { ModelService } from 'app/_services/model.service';
import {FilterService} from "../../../_services/filter.service";
import {FormControl} from "@angular/forms";
import {SitebillEntity} from "../../../_models";


@Component({
    selector   : 'search-string-parser',
    templateUrl: './search-string-parser.component.html',
    styleUrls  : ['./search-string-parser.component.scss'],
    animations : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class SearchStringParserComponent implements OnInit, OnDestroy
{
    // Private
    private _unsubscribeAll: Subject<any>;

    @Input('search_string')
    search_string: string;

    @Input('entity')
    entity: SitebillEntity;


    parsed_string: string;
    public result_message: string;


    /**
     * Constructor
     *
     */
    constructor(
        private modelService: ModelService,
        public filterService: FilterService,
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.filterService.share.subscribe((entity: SitebillEntity) => {
            if (entity.get_app_name() == this.entity.get_app_name()) {
                this.parse();
            }
        });
    }

    parse() {
        let parse_array = this.search_string.split(' ');
        this.result_message = '1 комн, 50 м';
        console.log(parse_array);
    }



    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}
