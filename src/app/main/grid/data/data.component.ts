import { Component } from '@angular/core';
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
        this.entity.app_name = 'data';
        this.entity.primary_key = 'id';
        this.enable_date_range('date_added');
    }
}
