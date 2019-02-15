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
    get_grid_items(params: any) {
        let grid_item;
        grid_item = ['id', 'city_id', 'metro_id', 'district_id', 'street_id', 'user_id', 'topic_id', 'number', 'price', 'image'];
        return grid_item;
    }

    setup_apps() {
        this.app_name = 'data';
        this.primary_key = 'id';

        this.data_columns = [
            {
                headerTemplate: this.hdrTpl,
                type: 'primary_key',
                ngx_name: 'id.title',
                model_name: 'id',
                title: 'ID',
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
            /*
            {
                headerTemplate: this.hdrTpl,
                type: 'select_by_query',
                ngx_name: 'district_id.title',
                model_name: 'district_id',
                title: 'Район',
                prop: 'district_id.value_string'
            },
            */
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
                type: 'select_by_query',
                ngx_name: 'user_id.title',
                model_name: 'user_id',
                title: 'Пользователь',
                prop: 'user_id.value_string'
            },
            {
                headerTemplate: this.hdrTpl,
                type: 'price',
                ngx_name: 'price.title',
                model_name: 'price',
                title: 'Цена',
                prop: 'price.value'
            },
            {
                headerTemplate: this.hdrTpl,
                cellTemplate: this.editTmpl,
                type: 'image',
                ngx_name: 'image.title',
                model_name: 'image',
                title: 'Фото',
                prop: 'image.value'
            },
            {
                headerTemplate: this.hdrTpl,
                cellTemplate: this.controlTmpl,
                type: 'primary_key',
                ngx_name: 'id.title',
                model_name: 'id',
                title: '',
                prop: 'id.value'
            },

        ];
    }
}
