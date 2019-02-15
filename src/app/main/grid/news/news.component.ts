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
export class NewsComponent extends GridComponent {
    get_grid_items(params: any) {
        let grid_item;
        grid_item = ['news_id', 'title'];
        return grid_item;
    }

    setup_apps() {
        this.app_name = 'news';
        this.primary_key = 'news_id';

        this.data_columns = [
            {
                headerTemplate: this.hdrTpl,
                type: 'primary_key',
                ngx_name: 'news_id.title',
                model_name: 'news_id',
                title: 'ID',
                prop: 'news_id.value'
            },
            {
                headerTemplate: this.hdrTpl,
                type: 'safe_string',
                ngx_name: 'news.title',
                model_name: 'title',
                title: 'Заголовок',
                prop: 'title.value'
            },
            {
                headerTemplate: this.hdrTpl,
                cellTemplate: this.controlTmpl,
                type: 'primary_key',
                ngx_name: 'news_id.title',
                model_name: 'news_id',
                title: '',
                prop: 'news_id.value'
            },


        ];
    }
}
