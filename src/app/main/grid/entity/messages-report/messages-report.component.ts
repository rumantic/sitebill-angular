import {Component, Input} from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'messages-report-grid',
    templateUrl: '../../grid.component.html',
    styleUrls: ['../../grid.component.scss'],
    animations: fuseAnimations
})
export class MessagesReportComponent extends GridComponent {

    @Input('client_id')
    client_id: number;

    setup_apps() {
        this.entity.set_app_name('messages_client_report');
        this.entity.set_table_name('messages_client_report');
        this.entity.primary_key = 'message_id';
        this.enable_select_rows = false;
        this.disable_add_button = true;
        this.disable_delete_button = true;
        this.disable_edit_button = true;
        this.disable_header = true;

        const default_columns_list = [
            'address',
            'square_all',
            'cost_meter_per_month4rent',
            'created_at',
            'status_id',
            'comment_text'
        ];
        this.define_grid_fields(default_columns_list);
        if ( this.client_id ) {
            this.entity.set_default_params({client_id: this.client_id});
        }

    }
}
