import {Component, Inject, Input} from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import {ModelService} from "../../../_services/model.service";
import {HouseSchemaService} from "../services/houseschema.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SitebillEntity} from "../../../_models";
import {FormComponent} from "../../grid/form/form.component";
import {NgxGalleryImage} from "ngx-gallery-9";
import {SafeResourceUrl} from "@angular/platform-browser";

@Component({
    selector   : 'house-schema-builder',
    templateUrl: './house-schema-builder.component.html',
    styleUrls  : ['./house-schema-builder.component.scss']
})
export class HouseSchemaBuilderComponent
{
    @Input("_data")
    _data: {
        entity: SitebillEntity,
        image_field: string,
        image_index: number,
        galleryImages: NgxGalleryImage[],
    }

    schema_url: SafeResourceUrl;

    /**
     * Constructor
     *
     */
    constructor(
        private modelService: ModelService,
        private houseSchemaService: HouseSchemaService,
    )
    {
    }


    ngOnInit() {
        if ( this._data ) {
            const image_index = this._data.image_index;
            this.schema_url = this._data.galleryImages[image_index].big;
            // console.log(this._data);
        } else {
            this.schema_url = "https://qplan.sitebill.site/img/data/20210121/jpg_6008feb8a8b6e_1611202232_1.svg?1611206294340";
        }
    }
}
