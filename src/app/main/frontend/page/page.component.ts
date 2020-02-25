import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {fuseAnimations} from '../../../../@fuse/animations';
import {FuseConfigService} from '../../../../@fuse/services/config.service';
import {FuseTranslationLoaderService} from '../../../../@fuse/services/translation-loader.service';
import {locale as english} from './i18n/en';
import {locale as russian} from './i18n/ru';
import {BillingService} from '../../../_services/billing.service';
import {FilterService} from '../../../_services/filter.service';
import {Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {LoginModalComponent} from '../../../login/modal/login-modal.component';
import {ModelService} from '../../../_services/model.service';

@Component({
    selector   : 'page',
    templateUrl: './page.component.html',
    styleUrls  : ['./page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class PageComponent
{
    private loading_in_progress: boolean;
    /**
     * Constructor
     *
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private billingSerivce: BillingService,
        protected router: Router,
        protected dialog: MatDialog,
        public modelService: ModelService,
        private filterService: FilterService,
        protected cdr: ChangeDetectorRef
    )
    {
        this.loading_in_progress = false;
        this._fuseTranslationLoaderService.loadTranslations(english, russian);
    }

    ngOnInit() {
        this.modelService.enable_guest_mode();
    }

    login_modal () {
        const dialogConfig = new MatDialogConfig();
        this.dialog.open(LoginModalComponent, dialogConfig);
    }
}
