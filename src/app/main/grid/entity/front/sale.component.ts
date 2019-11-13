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
    private setup_complete: boolean;

    setup_apps() {
        if ( this.input_entity ) {
            this.entity = this.input_entity;
            if ( this.entity.get_default_columns_list().length > 0 && !this.setup_complete ) {
                this.define_grid_fields(this.entity.get_default_columns_list());
                this.predefined_grid_fields = this.entity.get_default_columns_list();
                this.setup_complete = true;
            }
            if (this.entity.get_default_params().length > 0) {
                console.log('i want to be defined with params');
                console.log(this.entity.get_default_params());
                this.define_grid_params(this.entity.get_default_params());
            }

        }


        //this.table_index_params[0] = { user_id: 0 };
        //this.define_grid_params({ user_id: this.modelService.get_user_id() });
        //this.define_grid_params({ active: 1 });

        //let grid_fields = ['client_id', 'date', 'type_id', 'status_id', 'fio'];
        //let grid_fields = ['id', 'user_id', 'date', 'topic_id', 'street_id'];
        //this.define_grid_fields(grid_fields);
        //this.refresh();

        //this.add_my_tab();

    }

}
