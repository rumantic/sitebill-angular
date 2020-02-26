import {ChangeDetectionStrategy, Component} from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';


@Component({
    selector: 'data-grid',
    templateUrl: '../grid.component.html',
    styleUrls: ['../grid.component.scss'],
    animations: fuseAnimations
})
export class DataComponent extends GridComponent {
    setup_apps() {
        this.entity.set_app_name('data');
        this.entity.set_table_name('data');
        this.entity.primary_key = 'id';
        this.switch_collections(true);
        this.enable_date_range('date_added');
    }
    getRowClass(row): string {
        try {
            if (row['id'].collections != null) {
                return 'green-100-bg';
            }
        } catch {
        }

        try {
            if (row.active.value != 1) {
                return 'red-100-bg';
            }
            if (row.hot.value == 1) {
                return 'amber-100-bg';
            }
        } catch {
        }


    }

}
