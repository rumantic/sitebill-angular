import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {fuseAnimations} from "../../../../../../../@fuse/animations";
import {humanizeBytes, UploaderOptions, UploadFile, UploadInput, UploadOutput} from "ngx-uploader";
import {SitebillEntity} from "../../../../../../_models";
import {ModelService} from "../../../../../../_services/model.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
    selector: 'attach-modal',
    templateUrl: './attach-modal.component.html',
    styleUrls: ['./attach-modal.component.scss'],
    animations: fuseAnimations
})
export class AttachModalComponent  implements OnInit {
    public link: string;
    protected _unsubscribeAll: Subject<any>;
    public show_uploader = false;
    public files_column_name = 'files';


    onSave = new EventEmitter();
    galleryImages: any;
    public entity: SitebillEntity;

    constructor(
        private dialogRef: MatDialogRef<AttachModalComponent>,
        protected modelService: ModelService,
        @Inject(MAT_DIALOG_DATA) public _data: any
    ) {
        this._unsubscribeAll = new Subject();
        this.galleryImages = {};
        this.galleryImages[this.files_column_name] = [];
    }


    ngOnInit() {
        this.entity = new SitebillEntity();
        this.entity.set_app_name('files_queue');
        this.entity.set_table_name('files_queue');
        this.entity.primary_key = 'id';

        this.modelService.load_only_model(this.entity.get_app_name())
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                if (result) {
                    this.entity.model = result.columns;
                    this.show_uploader = true;
                }
            });
    }


    close() {
        this.dialogRef.close();
    }

    save(event) {
        //this.onSave.emit(event);
    }

    OnDestroy () {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    attach() {
        console.log(this.entity);
    }
}
