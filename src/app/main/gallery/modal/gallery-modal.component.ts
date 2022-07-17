import { Component, Inject, OnInit, Input} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { APP_CONFIG, AppConfig } from 'app/app.config.module';
import { ModelService } from 'app/_services/model.service';
import { FilterService } from 'app/_services/filter.service';
import {Observable} from 'rxjs';


@Component({
    selector: 'gallery-modal',
    templateUrl: './gallery-modal.component.html',
    styleUrls: ['./gallery-modal.component.css']
})
export class GalleryModalComponent implements OnInit {
    max_uploads: number = 100;

    data: any; // new

    $data: any; // new

    rerender = false; // new

    constructor(
        private dialogRef: MatDialogRef<GalleryModalComponent>,
        private modelSerivce: ModelService,
        private filterService: FilterService,
        @Inject(APP_CONFIG) private config: AppConfig,
        @Inject(MAT_DIALOG_DATA) public _data: any
    ) {
        this.data = this._data; // new

        // this.$data = new Observable((obs) => {
        //     obs.next(this.data);
        // });
    }

    // d = this.data$.subscribe({
    // next: (v) =>  v
    // });

    ngOnInit() {
        console.log(this.data);
        if (this._data.entity.app_name == 'user' && this._data.image_field == 'imgfile') {
            this.max_uploads = 1;
        }
    }

    // setRerender(): void { // new
    //     this.rerender = true;
    //     console.log('MODAL RERENDER');
    //     setTimeout(() => {
    //         this.rerender = false;
    //     }, 1500);
    // }

    close() {
        if ( !this._data.disable_gallery_controls ) {
            this.filterService.empty_share(this._data.entity);
        }
        this.dialogRef.close();
    }
    onImageArrayChange(array): void { // new
       this.data.galleryImages.image = array;
    }
}
