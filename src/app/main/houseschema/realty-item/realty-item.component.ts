import {Component, Input} from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as russian } from './i18n/ru';
import { ModelService } from 'app/_services/model.service';
import {Realty} from "../../../_models/realty";

@Component({
    selector   : 'realty-item',
    templateUrl: './realty-item.component.html',
    styleUrls  : ['./realty-item.component.scss']
})
export class RealtyItemComponent
{
    @Input('realty_item')
    realty_item: Realty;

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
