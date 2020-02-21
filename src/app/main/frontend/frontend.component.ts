import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FuseConfigService} from '@fuse/services/config.service';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as russian } from './i18n/ru';
import { ModelService } from 'app/_services/model.service';
import {fuseAnimations} from '../../../@fuse/animations';
import {Router} from '@angular/router';

@Component({
    selector   : 'frontend',
    templateUrl: './frontend.component.html',
    styleUrls  : ['./frontend.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class FrontendComponent
{
    loading = false;

    /**
     * Constructor
     *
     */
    constructor(
        private modelService: ModelService,
        private _fuseConfigService: FuseConfigService,
        protected router: Router,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, russian);
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: false
                },
                footer: {
                    hidden: true
                }
            }
        };
    }
    ngOnInit() {
        console.log('run frontend');
        // this.modelService.get_session_key_safe();
        // console.log(this.modelService.getConfigValue('default_frontend_route'));
    }
}
