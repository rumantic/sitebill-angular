import { Component, OnDestroy, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { fuseAnimations } from '@fuse/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModelService } from 'app/_services/model.service';
import { SitebillEntity } from 'app/_models';

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
    grid_items: string[];

    @Input("entity")
    entity: SitebillEntity;


    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private modelSerivce: ModelService,
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
        this.init_grid();
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
    init_grid() {
        this.modelSerivce.load_grid_columns(this.entity)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                console.log(result);
                this.grid_items = result.data;
                //this.load_grid_data(this.entity.app_name, result.data, params);
            });
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.grid_items, event.previousIndex, event.currentIndex);
        this.modelSerivce.format_grid(this.entity, this.grid_items)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                console.log(result);
                //this.load_grid_data(this.entity.app_name, result.data, params);
            });

        console.log('drop');
    }

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
