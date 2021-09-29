import {Component, Inject} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SitebillEntity, SitebillModelItem} from "../../../_models";

@Component({
    selector   : 'model-form-modal',
    templateUrl: './model-form-modal.component.html',
    styleUrls  : ['./model-form-modal.component.scss']
})
export class ModelFormModalComponent
{
    entity: SitebillEntity;

    /**
     * Constructor
     *
     */
    constructor(
        @Inject(MAT_DIALOG_DATA) public _data: {
            model_item: SitebillModelItem,
        },
        protected dialogRef: MatDialogRef<ModelFormModalComponent>,
    )
    {
        this.entity = new SitebillEntity();
        this.entity.set_app_name('columns');
        this.entity.set_table_name('columns');
        this.entity.set_primary_key('columns_id');
    }


    ngOnInit() {
        console.log(this._data.model_item);
    }

    close() {
        this.dialogRef.close();
    }

}
