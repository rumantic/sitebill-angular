import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
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

    constructor(
        protected modelService: ModelService,
        protected _formBuilder: FormBuilder,
        protected _snackService: SnackService,
        public _matDialog: MatDialog,
        protected filterService: FilterService,
        protected bitrix24Service: Bitrix24Service,
    ) {
        super(
            modelService,
            _formBuilder,
            _snackService,
            filterService,
            bitrix24Service,
            _matDialog,
        );
    }
}
