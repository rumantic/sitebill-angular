import {Component, isDevMode, ElementRef, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FuseConfigService} from '@fuse/services/config.service';
import {currentUser} from 'app/_models/currentuser';
import {DOCUMENT} from '@angular/common';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as russian } from './i18n/ru';
import { ModelService } from 'app/_services/model.service';

@Component({
    selector   : 'front-search',
    templateUrl: './front-search.component.html',
    styleUrls  : ['./front-search.component.scss']
})
export class FrontSearchComponent
{

    /**
     * Constructor
     *
     */
    constructor(
        private _httpClient: HttpClient,
        private elRef: ElementRef,
        private modelSerivce: ModelService,
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        @Inject(APP_CONFIG) private config: AppConfig,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, russian);
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: false
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                }
            }
        };
    }
    ngOnInit() {
    }
}
