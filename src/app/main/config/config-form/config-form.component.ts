import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Input, OnChanges,
    OnInit,
    Output
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {FormBuilder} from '@angular/forms';

import {APP_CONFIG, AppConfig} from 'app/app.config.module';
import {ModelService} from 'app/_services/model.service';
import {FormType, SitebillEntity} from 'app/_models';

import {FilterService} from 'app/_services/filter.service';
import {SnackService} from 'app/_services/snack.service';
import {Bitrix24Service} from 'app/integrations/bitrix24/bitrix24.service';
import {FormStaticComponent} from "../../grid/form/form-static.component";
import {EntityStorageService} from "../../../_services/entity-storage.service";
import {takeUntil} from "rxjs/operators";


@Component({
    selector: 'config-form-selector',
    templateUrl: '../../grid/form/form.component.html',
    styleUrls: ['../../grid/form/form.component.css'],
})
export class ConfigFormComponent extends FormStaticComponent implements OnInit,OnChanges  {
    @Input("config_items")
    config_items: any;

    constructor(
        protected modelService: ModelService,
        protected _formBuilder: FormBuilder,
        protected _snackService: SnackService,
        public _matDialog: MatDialog,
        protected filterService: FilterService,
        protected bitrix24Service: Bitrix24Service,
        protected entityStorageService: EntityStorageService,
        protected cdr: ChangeDetectorRef
    ) {
        super(
            modelService,
            _formBuilder,
            _snackService,
            _matDialog,
            filterService,
            bitrix24Service,
            entityStorageService,
            cdr,
        );
    }

    getModel(): void {
        const primary_key = this._data.primary_key;
        const key_value = this._data.get_key_value();
        const model_name = this._data.get_table_name();
        //console.log(this.modelService.entity);
        this.modelService.entity.set_app_name(this._data.get_app_name());
        this.modelService.entity.set_table_name(this._data.get_table_name());
        this.modelService.entity.primary_key = primary_key;
        this.modelService.entity.key_value = key_value;
        if ( this.predefined_ql_items ) {
            this._data.set_hidden(primary_key);
            this.modelService.entity.set_hidden(primary_key);
        }
        this.updateForm();
    }

    updateForm() {
        this.records = this.config_items;
        this.rows = Object.keys(this.config_items);
        this.tabs = {'Основное':this.rows};
        this.tabs_keys = ['Основное'];
        this.init_form();
    }

    ngOnChanges (changes) {
        if ( changes.config_items ) {
            this.updateForm();

        }
    }




    close() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}

