import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector     : 'grid-settings',
    templateUrl  : './settings.component.html',
    styleUrls    : ['./settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class GridSettingsSidenavComponent implements OnInit, OnDestroy
{
    board: any;
    view: string;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
    )
    {
        // Set the defaults
        this.view = 'main';

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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle card cover
     */
    toggleCardCover(): void
    {
    }

    /**
     * Toggle subscription
     */
    toggleSubscription(): void
    {
    }
}
