import {Component, Input} from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import {ModelService} from "../../../_services/model.service";
import {HouseSchemaService} from "../services/houseschema.service";

@Component({
    selector   : 'house-schema-builder',
    templateUrl: './house-schema-builder.component.html',
    styleUrls  : ['./house-schema-builder.component.scss']
})
export class HouseSchemaBuilderComponent
{
    @Input('keyValue') set setKeyValue(value) {
        if (!value) {
            return;
        }
        // this.keyValue = value;
    }

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
    }


}
