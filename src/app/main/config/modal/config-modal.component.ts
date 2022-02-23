import { Component, Inject, OnInit, Input} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { ModelService } from 'app/_services/model.service';
import { FilterService } from 'app/_services/filter.service';


@Component({
    selector: 'config-modal',
    templateUrl: './config-modal.component.html',
    styleUrls: ['./config-modal.component.scss']
})
export class ConfigModalComponent implements OnInit {

    constructor(
        private dialogRef: MatDialogRef<ConfigModalComponent>,
        public modelService: ModelService,
        @Inject(MAT_DIALOG_DATA) public _data: any
    ) {
    }

    ngOnInit() {
    }

    close() {
        this.dialogRef.close();
    }

}
