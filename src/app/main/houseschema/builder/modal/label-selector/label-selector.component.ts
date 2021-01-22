import {Component, Inject, Input} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NgxGalleryImage} from "ngx-gallery-9";
import {SitebillEntity} from "../../../../../_models";
import {FormComponent} from "../../../../grid/form/form.component";

@Component({
    selector   : 'label-selector',
    templateUrl: './label-selector.component.html',
    styleUrls  : ['./label-selector.component.scss']
})
export class LabelSelectorComponent
{
    /**
     * Constructor
     *
     */
    constructor(
        @Inject(MAT_DIALOG_DATA) public _data: {
            entity: SitebillEntity,
            image_field: string,
            image_index: number,
            galleryImages: NgxGalleryImage[],
        },
        protected dialogRef: MatDialogRef<FormComponent>,
    )
    {
    }


    ngOnInit() {
    }

    close() {
        this.dialogRef.close();
    }

}
