import { Component, TemplateRef, ViewChild } from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';
import { Page } from '../../page';
import { currentUser } from 'app/_models/currentuser';

@Component({
    selector: 'data-grid',
    templateUrl: './myclient.component.html',
    styleUrls: ['../../grid.component.scss'],
    animations: fuseAnimations
})
export class MyClientComponent extends GridComponent {
    @ViewChild('controlTmpl') controlTmpl: TemplateRef<any>;

    setup_apps() {
        this.entity.app_name = 'client';
        this.entity.primary_key = 'client_id';
        this.enable_date_range('date');

        this.table_index_params[0] = { user_id: 0 };

        this.add_my_tab();

    }

    add_my_tab() {
        let table_index = 1;
        let currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];

        this.table_index_params[table_index] = { user_id: currentUser.user_id };
        this.page.push(new Page());
        this.page[table_index].pageNumber = 0;
        this.page[table_index].size = 0;
        this.refresh(table_index);

    }

    get_control_column() {
        let control_column = {
            headerTemplate: this.commonTemplate.controlHdrTmpl,
            cellTemplate: this.controlTmpl,
            width: 40,
            type: 'primary_key',
            ngx_name: this.entity.primary_key + '.title',
            model_name: this.entity.primary_key,
            title: '',
            prop: this.entity.primary_key + '.value'
        }
        return control_column;

    }
}
