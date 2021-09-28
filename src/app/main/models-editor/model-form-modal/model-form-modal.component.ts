import {Component, Inject} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SitebillModelItem} from "../../../_models";

@Component({
    selector   : 'model-form-modal',
    templateUrl: './model-form-modal.component.html',
    styleUrls  : ['./model-form-modal.component.scss']
})
export class ModelFormModalComponent
{
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
    }


    ngOnInit() {
        console.log(this._data.model_item);
    }

    close() {
        this.dialogRef.close();
    }

}
