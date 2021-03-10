import {Component} from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as russian } from './i18n/ru';
import { ModelService } from 'app/_services/model.service';

@Component({
    selector   : 'memorylist-sidebar',
    templateUrl: './memorylist-sidebar.component.html',
    styleUrls  : ['./memorylist-sidebar.component.scss']
})
export class MemorylistSidebarComponent
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
