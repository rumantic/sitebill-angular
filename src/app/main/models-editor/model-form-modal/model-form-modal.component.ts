import {Component, Inject, ViewChild} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SitebillEntity, SitebillModelItem} from "../../../_models";
import {ModelFormStaticComponent} from "./model-form-static.component";

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
        console.log('onChange');
        console.log(type);
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

        let select_by_query_items = ['primary_key_table'];

        let visibility = {
            'select_by_query': common_fields.concat(select_by_query_items),
            'select_by_query_multiple': common_fields.concat(select_by_query_items),
            'select_by_query_multi': common_fields.concat(select_by_query_items),
        };



        console.log(this.form_static.get_records());
        for (const [key, value] of Object.entries(this.form_static.get_records())) {
            if ( !common_fields.includes(key) ) {
                console.log(key);
                this.form_static.hide_row(key);
            }
        }


        // this.form_static.get_records().forEach(record => {
        //     console.log(record);
        // });

        //this.form_static.hide_row('table_id');

        //console.log(common_fields);
    }
}
