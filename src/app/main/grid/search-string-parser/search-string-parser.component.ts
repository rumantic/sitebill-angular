import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';


import { Subject } from 'rxjs';
import { ModelService } from 'app/_services/model.service';


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

    /**
     * Constructor
     *
     */
    constructor(
        private modelService: ModelService,
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
