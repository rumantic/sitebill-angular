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
                ngx_name: 'city_id.title',
                model_name: 'city_id',
                title: 'Город',
                prop: 'city_id.value_string'
            },
            {
                headerTemplate: this.hdrTpl,
                name: 'street_id.title',
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
