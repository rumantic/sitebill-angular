import {Component, Inject, ViewChild} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SitebillEntity, SitebillModelItem} from "../../../_models";
import {ModelFormStaticComponent} from "./model-form-static.component";
import {ModelService} from "../../../_services/model.service";

@Component({
    selector   : 'model-form-modal',
    templateUrl: './model-form-modal.component.html',
    styleUrls  : ['./model-form-modal.component.scss']
})
export class ModelFormModalComponent
{
    entity: SitebillEntity;
    @ViewChild(ModelFormStaticComponent) form_static: ModelFormStaticComponent;

    /**
     * Constructor
     *
     */
    constructor(
        @Inject(MAT_DIALOG_DATA) public _data: {
            model_item: SitebillModelItem,
        },
        protected modelService: ModelService,
        protected dialogRef: MatDialogRef<ModelFormModalComponent>,
    )
    {
        this.entity = new SitebillEntity();
        this.entity.set_app_name('columns');
        this.entity.set_table_name('columns');
        this.entity.set_primary_key('columns_id');
        this.entity.set_hidden('columns_id');
        this.entity.set_key_value(this._data.model_item.columns_id);
        // this.entity.set_title('колонки');
    }


    ngOnInit() {
    }

    close() {
        this.dialogRef.close();
    }

    update_form_fields_visibility( type: string = null ) {
        if ( !type ) {
            type = this.form_static.form.controls['type'].value;
        }

        console.log(this.language_extends('title'));


        let common_fields = [
            'name',
            'active',
            'table_id',
            'group_id',
            'title',
            'value',
            'type',
            'required',
            'unique',
            'dbtype',
            'active_in_topic',
            'tab',
            'hint',
            'parameters',
            'uaction'
        ];
        let result_fields = common_fields;

        let select_by_query_items = [
            'primary_key_name',
            'primary_key_table',
            'value_string',
            'query',
            'value_name',
            'title_default',
            'value_default',
            'combo'
        ];

        let type_visibility_fields = {
            'select_by_query': select_by_query_items,
            'select_by_query_multiple': select_by_query_items,
            'select_by_query_multi': select_by_query_items,
            'structure': ['entity'],
            'select_box_structure': ['value_string', 'title_default'],
            'select_box': ['select_data'],
            'grade': ['select_data'],

        };
        if (type_visibility_fields[type]) {
            result_fields = common_fields.concat(type_visibility_fields[type]);
        }
        for (const [key, value] of Object.entries(this.form_static.get_records())) {
            if ( !result_fields.includes(key) ) {
                this.form_static.hide_row(key);
            } else {
                this.form_static.show_row_soft(key);
            }
        }
    }

    language_extends ( key: string ) {
        let languages = this.modelService.getConfigValue('languages');
        if ( !languages ) {
            return key;
        }
        let result = [];
        result.push(key);
        for (const [key_obj, value_obj] of Object.entries(languages)) {
            result.push(key + '_' + key_obj);
        }
        return result;
    }
}
