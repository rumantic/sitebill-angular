import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {fuseAnimations} from '../../../../@fuse/animations';
import {ModelService} from '../../../_services/model.service';
import {SnackService} from '../../../_services/snack.service';
import {SitebillEntity} from "../../../_models";

@Component({
    selector: 'excel-apps',
    templateUrl: './excel.component.html',
    styleUrls: ['./excel.component.scss'],
    animations: fuseAnimations
})
export class ExcelComponent  implements OnInit {
    public link: string;
    entity: SitebillEntity;

    onSave = new EventEmitter();

    constructor(
        protected modelService: ModelService,
        protected _snackService: SnackService,
    ) {
    }


    ngOnInit() {
    }

}
