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
        console.log('setup data');

        this.app_name = 'data';
        this.data_columns = [
            {
                headerTemplate: this.hdrTpl,
                name: 'id.title',
                prop: 'id.value'
            },
            {
                headerTemplate: this.hdrTpl,
                name: 'city_id.title',
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

        const load_selected_request = { action: 'model', do: 'load_selected', session_key: this.currentUser.session_key };

        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, load_selected_request)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                this.refreash();


                this.loadingIndicator = false;
            });

    }
}
