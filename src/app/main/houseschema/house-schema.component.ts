import {Component} from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as russian } from './i18n/ru';
import { ModelService } from 'app/_services/model.service';

@Component({
    selector   : 'house-schema',
    templateUrl: './house-schema.component.html',
    styleUrls  : ['./house-schema.component.scss']
})
export class HouseSchemaComponent
{
    /**
     * Constructor
     *
     */
    constructor(
        private modelService: ModelService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, russian);
    }
    ngOnInit() {
    }


}
