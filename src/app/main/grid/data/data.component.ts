import { Component, OnInit } from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';
import { takeUntil } from 'rxjs/operators';


@Component({
    selector: 'data-grid',
    templateUrl: '../grid.component.html',
    styleUrls: ['../grid.component.scss'],
    animations: fuseAnimations
})
export class DataComponent extends GridComponent {
    setup_apps() {
        this.app_name = 'data';
        this.data_columns = [
            {
                headerTemplate: this.hdrTpl,
                name: 'id.title',
                prop: 'id.value'
            },
            {
                headerTemplate: this.hdrTpl,
                type: 'select_by_query',
                ngx_name: 'topic_id.title',
                model_name: 'topic_id',
                title: 'Тип',
                prop: 'topic_id.value_string'
            },

            {
                headerTemplate: this.hdrTpl,
                type: 'select_by_query',
                ngx_name: 'city_id.title',
                model_name: 'city_id',
                title: 'Город',
                prop: 'city_id.value_string'
            },
            {
                headerTemplate: this.hdrTpl,
                type: 'select_by_query',
                ngx_name: 'district_id.title',
                model_name: 'district_id',
                title: 'Район',
                prop: 'district_id.value_string'
            },
            {
                headerTemplate: this.hdrTpl,
                type: 'select_by_query',
                ngx_name: 'street_id.title',
                model_name: 'street_id',
                title: 'Улица',
                prop: 'street_id.value_string'
            },
            {
                headerTemplate: this.hdrTpl,
                name: 'price',
                prop: 'price.value'
            },
            {
                headerTemplate: this.hdrTpl,
                cellTemplate: this.editTmpl,
                name: 'image',
                prop: 'image.value'
            },
        ];
    }
}
