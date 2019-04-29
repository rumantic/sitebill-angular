import { Component, TemplateRef, ViewChild } from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';
import { Page } from '../../page';
import { currentUser } from 'app/_models/currentuser';
import { DeclineClientComponent } from 'app/dialogs/decline-client/decline-client.component';
import { MatDialogConfig } from '@angular/material';

@Component({
    selector: 'freeclient-grid',
    templateUrl: './myclient.component.html',
    styleUrls: ['../../grid.component.scss'],
    animations: fuseAnimations
})
export class FreeClientComponent extends GridComponent {
    @ViewChild('controlTmpl') controlTmpl: TemplateRef<any>;
    @ViewChild('controlTmplMy') controlTmplMy: TemplateRef<any>;
    @ViewChild('hdrTpl') hdrTpl: TemplateRef<any>;

    setup_apps() {
        this.entity.app_name = 'client';
        this.entity.primary_key = 'client_id';
        //this.enable_date_range('date');

        //this.table_index_params[0] = { user_id: 0 };
        this.define_grid_params({ user_id: 0 });

        let grid_fields = ['client_id', 'date', 'type_id', 'status_id', 'fio'];
        this.define_grid_fields(grid_fields);
        //this.refresh();

        //this.add_my_tab();

    }

    add_my_tab() {
        let table_index = 1;

        //this.table_index_params[table_index] = { user_id: this.currentUser.user_id };

        let grid_fields = ['client_id', 'user_id','date', 'type_id', 'status_id', 'fio', 'phone'];
        this.define_grid_fields(grid_fields);

        this.refresh();

    }

    get_control_column() {
        let cellTemplate = this.controlTmpl;
        //if (table_index == 1) {
        //    cellTemplate = this.controlTmplMy;
        //}

        let control_column = {
            headerTemplate: this.commonTemplate.controlHdrTmpl,
            cellTemplate: cellTemplate,
            width: 40,
            type: 'primary_key',
            ngx_name: this.entity.primary_key + '.title',
            model_name: this.entity.primary_key,
            title: '',
            prop: this.entity.primary_key + '.value'
        }
        return control_column;

    }

    get_header_template() {
        return this.hdrTpl;
    }


    toggleUserGet(event) {
        //console.log(event);
        let row = event.row;
        let value = event[this.entity.primary_key].value;
        let ql_items = {};

        ql_items['user_id'] = this.currentUser.user_id;

        this.modelSerivce.update_only_ql(this.entity.app_name, value, ql_items)
            .subscribe((response: any) => {
                if (response.state == 'error') {
                    this._snackService.message(response.message);
                } else {
                    this.refresh();
                }
            });
    }

    declineClient(row) {
        //console.log('user_id');
        //console.log(row.client_id.value);

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        //dialogConfig.width = '100%';
        //dialogConfig.height = '100%';
        dialogConfig.autoFocus = true;
        dialogConfig.data = { app_name: this.entity.app_name, primary_key: 'client_id', key_value: row.client_id.value };

        let dialogRef = this.dialog.open(DeclineClientComponent, dialogConfig);
        dialogRef.afterClosed()
            .subscribe(() => {
                this.refresh();
            })
        return;
    }



}
