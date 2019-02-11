import {Component, isDevMode, ElementRef, Inject, TemplateRef, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FuseConfigService} from '@fuse/services/config.service';
import {currentUser} from 'app/_models/currentuser';
import {DOCUMENT} from '@angular/platform-browser';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as russian } from './i18n/ru';
import { Subject } from 'rxjs';
import { FilterService } from 'app/_services/filter.service';
import { FilterComponent } from 'app/main/documentation/components-third-party/datatable/filter.component';


@Component({
    selector   : 'grid',
    templateUrl: './grid.component.html',
    styleUrls  : ['./grid.component.scss']
})
export class GridComponent
{
    rows = [];
    item_model: any[];
    rows_my = [];
    rows_data = [];
    selected = [];
    loadingIndicator: boolean;
    loadGridComplete: boolean;
    reorderable: boolean;
    api_url: string;
    records: any[];
    columns = [];
    data_columns = [];
    columns_client_all = [];
    columns_data_all = [];
    columns_client_my = [];
    rows1 = [];
    app_name: string;
    total_all: number;
    total_my: number;
    data_all: number;
    editing = {};
    options_test = {};
    test_indicator: string;
    objectKeys = Object.keys;


    @ViewChild('hdrTpl') hdrTpl: TemplateRef<any>;
    @ViewChild('editTmpl') editTmpl: TemplateRef<any>;
    @ViewChild('clientControlTmpl') clientControlTmpl: TemplateRef<any>;
    @ViewChild('clientIdTmpl') clientIdTmpl: TemplateRef<any>;
    @ViewChild('FilterComponent') filterTmpl: TemplateRef<any>;
    @ViewChild('clientStatusIdTmpl') clientStatusIdTmpl: TemplateRef<any>;

    private filter: number;




    // Private
    private _unsubscribeAll: Subject<any>;
    private currentUser: currentUser;

    
    /**
     * Constructor
     *
     */
    constructor(
        private _httpClient: HttpClient,
        private elRef: ElementRef,
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        @Inject(APP_CONFIG) private config: AppConfig,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private filterService: FilterService
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, russian);
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];
        if (isDevMode()) {
            this.api_url = this.config.apiEndpoint;
        } else {
            this.api_url = '';
        }
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
    
    init_input_parameters () {
        let app_root_element;
        if (this.document.getElementById('calculator_mini_root')) {
            app_root_element = this.document.getElementById('calculator_mini_root');
        } else if (this.document.getElementById('app_root').getAttribute('realty_price') > 0) {
            app_root_element = this.document.getElementById('app_root');
        }
    }
    
    
}
