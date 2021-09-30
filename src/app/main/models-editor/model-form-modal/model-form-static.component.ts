import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input, OnChanges,
    OnInit,
    Output
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FormBuilder} from '@angular/forms';

import {ModelService} from 'app/_services/model.service';

import {FilterService} from 'app/_services/filter.service';
import {SnackService} from 'app/_services/snack.service';
import {Bitrix24Service} from 'app/integrations/bitrix24/bitrix24.service';
import {FormStaticComponent} from "../../grid/form/form-static.component";
import {EntityStorageService} from "../../../_services/entity-storage.service";
import {takeUntil} from "rxjs/operators";
import {MAT_TOOLTIP_DEFAULT_OPTIONS} from "@angular/material/tooltip";
import {myCustomTooltipDefaults} from "../../grid/form/form-constructor.component";


@Component({
    selector: 'model-form-static',
    templateUrl: '../../grid/form/form.component.html',
    styleUrls: ['../../grid/form/form.component.css'],
    providers: [
        {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}
    ],
})
export class ModelFormStaticComponent extends FormStaticComponent implements OnInit,OnChanges  {
    @Output() onChangeType: EventEmitter<string>  = new EventEmitter();
    private previous_type: string;

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

    initSubscribers() {
        super.initSubscribers();
        this.form.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((status) => {
                if ( status.type && this.previous_type !== status.type ) {
                    this.previous_type = status.type;
                    this.onChangeType.emit(status.type);
                }
            });
    }

    ngOnChanges (changes) {
    }
}

