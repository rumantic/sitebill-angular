import {Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import {SitebillEntity, SitebillModelItem} from "../../../_models";
import {ModelsEditorService} from "../models-editor.service";
import {takeUntil} from "rxjs/operators";
import {SitebillResponse} from "../../../_models/sitebill-response";
import {SnackService} from "../../../_services/snack.service";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {ModelFormModalComponent} from "../model-form-modal/model-form-modal.component";
import {ConfirmComponent} from "../../../dialogs/confirm/confirm.component";
import {ModelService} from "../../../_services/model.service";
import {DatatableComponent} from "@swimlane/ngx-datatable";


@Component({
    selector     : 'model-details',
    templateUrl  : './model-details.component.html',
    styleUrls    : ['./model-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ModelDetailsComponent implements OnInit, OnDestroy
{
    @Input()
    model: SitebillEntity;

    public sitebillResponse:SitebillResponse;

    @ViewChild('titleInput')
    titleInputField;
    SelectionType = 'checkbox';

    columns = [];
    rows = [];

    @ViewChild('table', { static: false }) table: DatatableComponent;


    // Private
    private _unsubscribeAll: Subject<any>;
    private confirmDialogRef: MatDialogRef<ConfirmComponent>;

    /**
     * Constructor
     *
     * @param _snackService
     * @param _modelsEditorService
     * @param dialog
     * @param _matDialog
     * @param modelService
     */
    constructor(
        protected _snackService: SnackService,
        protected _modelsEditorService: ModelsEditorService,
        protected dialog: MatDialog,
        public _matDialog: MatDialog,
        protected modelService: ModelService,
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

    toggle_active (model_item: SitebillModelItem, toggled_column: string) {
        this.toggle(model_item, toggled_column, false);
    }

    toggle(model_item: SitebillModelItem, toggled_column: string, post_update: boolean = true) {
        if ( !post_update ) {
            model_item[toggled_column] = !model_item[toggled_column];
        }
        this._modelsEditorService.toggle(model_item.columns_id, toggled_column)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                Object.assign(this.sitebillResponse, result);
                if ( this.sitebillResponse.success() ) {
                    this._snackService.message(this.sitebillResponse.message);
                    if ( post_update ) {
                        model_item[toggled_column] = !model_item[toggled_column];
                    }
                } else {
                    this._snackService.error(this.sitebillResponse.message);
                }
            });
    }

    getRowClass(row): string {
        try {
            if (row.active != 1) {
                return 'red-100-bg';
            }
        } catch {
        }
    }

    edit(model_item: SitebillModelItem) {
        //console.log('view');
        //console.log(item_id);
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        //dialogConfig.data = { app_name: this.entity.get_table_name(), primary_key: this.entity.primary_key, key_value: item_id };
        dialogConfig.data = {
            model_item: model_item
        };
        dialogConfig.panelClass = 'regular-modal';

        this.dialog.open(ModelFormModalComponent, dialogConfig);
    }


    delete(model_item: SitebillModelItem, rowIndex: number) {
        this.confirmDialogRef = this._matDialog.open(ConfirmComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Вы уверены, что хотите удалить запись?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.modelService.delete('columns', 'columns_id', model_item.columns_id)
                    .subscribe((response: any) => {
                        if (response.state == 'error') {
                            this._snackService.message(response.message);
                            return null;
                        } else {
                            this.model.model = this.model.model.filter((item: SitebillModelItem) => {
                                return item.columns_id != model_item.columns_id;
                            });
                            this.model.model = [...this.model.model];
                            this._snackService.message('Запись удалена успешно');
                        }
                    });
            }
            this.confirmDialogRef = null;
        });
    }
}
