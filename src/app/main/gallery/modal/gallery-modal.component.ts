import { Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

import { APP_CONFIG, AppConfig } from 'app/app.config.module';
import { ModelService } from 'app/_services/model.service';


@Component({
    selector: 'gallery-modal',
    templateUrl: './gallery-modal.component.html',
    styleUrls: ['./gallery-modal.component.css']
})
export class GalleryModalComponent implements OnInit {



    constructor(
        private dialogRef: MatDialogRef<GalleryModalComponent>,
        private modelSerivce: ModelService,
        @Inject(APP_CONFIG) private config: AppConfig,
        @Inject(MAT_DIALOG_DATA) private _data: any
    ) {
    }

    ngOnInit() {
    }

    close() {
        this.dialogRef.close();
    }

}
