import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FormBuilder} from '@angular/forms';

import {ModelService} from 'app/_services/model.service';
import {SitebillEntity} from 'app/_models';

import {FilterService} from 'app/_services/filter.service';
import {SnackService} from 'app/_services/snack.service';
import {Bitrix24Service} from 'app/integrations/bitrix24/bitrix24.service';
import {FormConstructorComponent} from './form-constructor.component';


@Component({
    selector: 'form-static',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css']
})
export class FormStaticComponent extends FormConstructorComponent implements OnInit {
    @Input("entity")
    _data: SitebillEntity;

    @Input("disable_delete")
    disable_delete: boolean;

    @Input("disable_form_title_bar")
    disable_form_title_bar: boolean;

    @Input("disable_save_button")
    disable_save_button: boolean;

    @Input("disable_cancel_button")
    disable_cancel_button: boolean;

    @Output() onClose = new EventEmitter();
    @Output() save_output = new EventEmitter();

    constructor(
        protected modelService: ModelService,
        protected _formBuilder: FormBuilder,
        protected _snackService: SnackService,
        public _matDialog: MatDialog,
        protected filterService: FilterService,
        protected bitrix24Service: Bitrix24Service,
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
    save() {
        super.save();
        this.onClose.emit(true);
    }
    close() {
        super.close();
        this.onClose.emit(true);
    }
}

