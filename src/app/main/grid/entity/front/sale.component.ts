import { Component, TemplateRef, ViewChild } from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';
import { Page } from '../../page';
import { currentUser } from 'app/_models/currentuser';
import { DeclineClientComponent } from 'app/dialogs/decline-client/decline-client.component';
import { MatDialogConfig } from '@angular/material';

@Component({
    selector: 'sale-grid',
    templateUrl: '../../grid.component.html',
    styleUrls: ['../../grid.component.scss'],
    animations: fuseAnimations
})
export class SaleComponent extends GridComponent {

    setup_apps() {
        this.entity.set_app_name('sale');
        this.entity.set_table_name('data');
        this.entity.primary_key = 'id';
        this.enable_date_range('date');

        //this.table_index_params[0] = { user_id: 0 };
        //this.define_grid_params({ user_id: this.modelService.get_user_id() });

        //let grid_fields = ['client_id', 'date', 'type_id', 'status_id', 'fio'];
        //let grid_fields = ['id', 'user_id', 'date', 'topic_id', 'street_id'];
        //this.define_grid_fields(grid_fields);
        //this.refresh();

        //this.add_my_tab();

    }

}
