import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';

import { takeUntil } from 'rxjs/operators';
import {SitebillEntity} from "../../../_models";
import {ModelService} from "../../../_services/model.service";
import {SnackService} from "../../../_services/snack.service";
import {SitebillResponse} from "../../../_models/sitebill-response";
import {ModelsEditorService} from "../models-editor.service";

@Component({
    selector     : 'model-list',
    templateUrl  : './model-list.component.html',
    styleUrls    : ['./model-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ModelListComponent implements OnInit, OnDestroy
{
    models: SitebillEntity[];
    currentModel: SitebillEntity;
    public sitebillResponse:SitebillResponse;


    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     */
    constructor(
        protected modelService: ModelService,
        protected _snackService: SnackService,
        protected _modelsEditorService: ModelsEditorService,
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.sitebillResponse = new SitebillResponse();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.modelService.get_models_list()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                Object.assign(this.sitebillResponse, result);
                if ( this.sitebillResponse.success() ) {
                    console.log(this.sitebillResponse.data);
                    this.models = [];
                    for (const [key, value] of Object.entries(this.sitebillResponse.data)) {
                        console.log(key);
                        let entity = new SitebillEntity();
                        entity.set_app_name(key);
                        entity.set_table_name(key);
                        this.models.push(entity);
                    }

                    /*
                    this.menuItems = Object.keys(this.sitebillResponse.data);
                    this.itemsList = this.sitebillResponse.data;
                    let result_tmp = [];
                    for (const [key, value] of Object.entries(this.itemsList['articles'])) {
                        result_tmp.push(value);
                    }
                    console.log(result_tmp);
                    this.rows = result_tmp;
                     */
                } else {
                    this._snackService.error(this.sitebillResponse.message);
                }
            });
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
     * Read model
     *
     * @param model_name
     */
    selectModel(model: SitebillEntity): void
    {
        this._modelsEditorService.setCurrentModel(model);
    }

    isSelected ( model: SitebillEntity ) {
        if ( model === this._modelsEditorService.getCurrentModel() ) {
            return true;
        }
        return false;
    }

    /**
     * On drop
     *
     * @param ev
     */
    onDrop(ev): void
    {

    }
}
