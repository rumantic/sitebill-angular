import {Component} from '@angular/core';
import {FuseConfigService} from '@fuse/services/config.service';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as russian } from './i18n/ru';
import { ModelService } from 'app/_services/model.service';
import {fuseAnimations} from '../../../@fuse/animations';
import {Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {LoginModalComponent} from '../../login/modal/login-modal.component';

@Component({
    selector   : 'standalone-runner',
    templateUrl: './standalone-runner.component.html',
    styleUrls  : ['./standalone-runner.component.scss'],
    animations: fuseAnimations
})
export class StandaloneRunnerComponent
{
    loading = false;
    config_loaded = false;

    /**
     * Constructor
     *
     */
    constructor(
        public modelService: ModelService,
        private _fuseConfigService: FuseConfigService,
        protected router: Router,
        protected dialog: MatDialog,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, russian);
    }
    ngOnInit() {
        console.log('run standalone ...');
        // this.modelService.enable_model_redirect();
        if ( this.modelService.all_checks_passes() ) {
            this.config_loaded = true;
        } else if (this.modelService.final_state()) {
            this.config_loaded = true;
        } else {
            this.modelService.sitebill_loaded_complete_emitter.subscribe(
                (result: any) => {
                    this.config_loaded = true;
                    if ( result === true ) {
                        this.enable_guest_mode();
                    } else {
                        console.log('config loaded result = false');
                    }
                },
                error => {
                    console.log('error');
                    console.log(error);
                },
                complete => {
                    console.log('config_loaded_emitter complete')
                }
            );
        }

    }

    enable_guest_mode () {
        console.log('guest mode check');
        if ( this.modelService.get_user_id() === null || this.modelService.get_user_id() === undefined ) {
            this.modelService.enable_guest_mode();
        } else {
            console.log('session_key = ' + this.modelService.get_session_key_safe());
            console.log('this.modelService.get_user_id() = ' + this.modelService.get_user_id());
        }
    }


}
