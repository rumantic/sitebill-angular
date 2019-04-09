import { Component, OnDestroy, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { fuseAnimations } from '@fuse/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModelService } from 'app/_services/model.service';
import { SitebillEntity, SitebillModelItem } from 'app/_models';
import { FilterService } from 'app/_services/filter.service';
import { Page } from '../../page';

@Component({
    selector     : 'grid-settings',
    templateUrl  : './settings.component.html',
    styleUrls    : ['./settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class GridSettingsSidenavComponent implements OnInit
{
    board: any;
    view: string;

    @Input("entity")
    entity: SitebillEntity;

    @Input("grid_items")
    grid_items: any[];

    @Input("page")
    page: Page;

    page_options: number[];
    per_page: number;

    active_columns: SitebillModelItem[];
    not_active_columns: SitebillModelItem[];
    protected _unsubscribeAll: Subject<any>;
    init_columns_complete: boolean = false;



    constructor(
        private modelSerivce: ModelService,
        private filterService: FilterService
    )
    {
        this._unsubscribeAll = new Subject();

        // Set the defaults
        this.view = 'main';
        this.page_options = [5,10,20,30,40,50,60,70,80,90,100];
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.per_page = this.page.size;
        console.log(this.per_page);
        this.init_grid();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    init_grid() {
        let grid_items = this.grid_items;
        if (grid_items.length == 0) {
            grid_items = this.entity.default_columns_list;
        }

        this.active_columns = [];
        this.not_active_columns = [];
        //this.not_active_columns = this.entity.model;
        //this.not_active_columns = Object.assign([], this.entity.model);


        //console.log(this.entity.model);
        //console.log(grid_items);
        //console.log(this.entity.columns_index);
        //console.log(this.not_active_columns);

        //массив активных колонок
        grid_items.forEach((item, index) => {
            this.active_columns.push(this.entity.model[this.entity.columns_index[item]]);
        });

        this.entity.model.forEach((item, index) => {
            if (grid_items.indexOf(item.name) == -1 ) {
                //console.log(item.name);
                this.not_active_columns.push(item);
            }
            //if (this.entity.columns_index[item.name]  != ) {
            //}

        });


        this.init_columns_complete = true;
        /*

        */
        //this.not_active_columns.splice(3, 1);

        //console.log(this.active_columns);
        //console.log(this.not_active_columns);
    }

    drop(event: CdkDragDrop<string[]>) {
        //console.log('drop');

        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
        //moveItemInArray(this.grid_items, event.previousIndex, event.currentIndex);
        let new_grid_items = [];
        this.active_columns.forEach((item, index) => {
            new_grid_items.push(item.name);
        });

        this.modelSerivce.format_grid(this.entity, new_grid_items, this.per_page)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result_f1: any) => {
                this.filterService.empty_share(this.entity);
            });

    }

    per_page_change(event) {
        const params = event.value;

        this.modelSerivce.update_column_meta(this.entity.app_name, null, 'per_page', params)
            .subscribe((response: any) => {
                this.filterService.empty_share(this.entity);
            });

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
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}
