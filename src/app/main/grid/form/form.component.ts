import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {FormBuilder} from '@angular/forms';

import {APP_CONFIG, AppConfig} from 'app/app.config.module';
import {ModelService} from 'app/_services/model.service';
import {SitebillEntity} from 'app/_models';

import {FilterService} from 'app/_services/filter.service';
import {SnackService} from 'app/_services/snack.service';
import {Bitrix24Service} from 'app/integrations/bitrix24/bitrix24.service';
import {FormConstructorComponent} from './form-constructor.component';


@Component({
    selector: 'form-selector',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent extends FormConstructorComponent implements OnInit {

    constructor(
        protected dialogRef: MatDialogRef<FormComponent>,
        protected modelService: ModelService,
        protected _formBuilder: FormBuilder,
        protected _snackService: SnackService,
        public _matDialog: MatDialog,
        protected filterService: FilterService,
        protected bitrix24Service: Bitrix24Service,
        @Inject(APP_CONFIG) protected config: AppConfig,
        @Inject(MAT_DIALOG_DATA) public _data: SitebillEntity,
        protected cdr: ChangeDetectorRef
    ) {
        super(
            modelService,
            _formBuilder,
            _snackService,
            filterService,
            bitrix24Service,
            _matDialog,
            cdr,
        );
    }


    close() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.dialogRef.close();
    }
    inline_create(record) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        //dialogConfig.width = '99vw';
        //dialogConfig.maxWidth = '99vw';
        //dialogConfig.height = '99vh';
        let entity = new SitebillEntity();
        entity.set_table_name(record.primary_key_table);
        entity.set_app_name(record.primary_key_table);
        entity.set_primary_key(record.primary_key_name);
        dialogConfig.data = entity;
        dialogConfig.panelClass = 'inline-dialog';
        //console.log(model_name);


        this._matDialog.open(FormComponent, dialogConfig);

        /*
        this.entity.set_key_value(item_id);
        if (this.only_collections) {
            this.entity.set_hook('add_to_collections');
        }
        dialogConfig.data = this.entity;
        dialogConfig.panelClass = 'form-ngrx-compose-dialog';
        if ( this.modelService.getConfigValue('apps.products.limit_add_data') === '1') {
            this.billingService.get_user_limit('exclusive').subscribe(
                (limit: any) => {
                    if ( limit.data > 0 ) {
                        this.open_form_with_check_access(dialogConfig);
                    } else {
                        this._snackService.message('Закончился лимит добавления эксклюзивных вариантов', 5000);
                    }
                }
            );
        } else {
            this.open_form_with_check_access(dialogConfig);
            //this.dialog.open(FormComponent, dialogConfig);
        }
         */


    }

}

