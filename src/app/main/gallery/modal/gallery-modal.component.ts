import { Component, Inject, OnInit, Input} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

import { APP_CONFIG, AppConfig } from 'app/app.config.module';
import { ModelService } from 'app/_services/model.service';
import { NgxGalleryImage } from 'ngx-gallery';
import { SitebillEntity } from 'app/_models';
import { FilterService } from 'app/_services/filter.service';


@Component({
    selector: 'gallery-modal',
    templateUrl: './gallery-modal.component.html',
    styleUrls: ['./gallery-modal.component.css']
})
export class GalleryModalComponent implements OnInit {

    constructor(
        private dialogRef: MatDialogRef<GalleryModalComponent>,
        private modelSerivce: ModelService,
        private filterService: FilterService,
        @Inject(APP_CONFIG) private config: AppConfig,
        @Inject(MAT_DIALOG_DATA) public _data: any
    ) {
    }

    ngOnInit() {
    }

    close() {
        this.filterService.empty_share(this._data.entity);
        this.dialogRef.close();
    }

}
