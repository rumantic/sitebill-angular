import {Component, EventEmitter, Inject, Input, OnInit} from '@angular/core';
import {fuseAnimations} from '../../../../@fuse/animations';
import {ModelService} from '../../../_services/model.service';
import {SnackService} from '../../../_services/snack.service';
import {ApiCall, ApiParams, SitebillEntity} from "../../../_models";
import {UploaderOptions, UploadFile, UploadInput, humanizeBytes, UploadOutput} from "ngx-uploader";

@Component({
    selector: 'excel-apps',
    templateUrl: './excel.component.html',
    styleUrls: ['./excel.component.scss'],
    animations: fuseAnimations
})
export class ExcelComponent  implements OnInit {
    public link: string;
    options: UploaderOptions;
    formData: FormData;
    files: UploadFile[];
    uploadInput: EventEmitter<UploadInput>;
    humanizeBytes: Function;
    dragOver: boolean;
    excel_upload_api: ApiCall;

    @Input("entity")
    entity: SitebillEntity;

    onSave = new EventEmitter();

    constructor(
        protected modelService: ModelService,
        protected _snackService: SnackService,
    ) {
        this.options = { concurrency: 1, maxUploads: 3, maxFileSize: 1000000 };
        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;
    }


    ngOnInit() {
        console.log(this.entity);
    }

    onUploadOutput(output: UploadOutput): void {
        switch (output.type) {
            case 'allAddedToQueue':
                // uncomment this if you want to auto upload files when added
                // const event: UploadInput = {
                //   type: 'uploadAll',
                //   url: '/upload',
                //   method: 'POST',
                //   data: { foo: 'bar' }
                // };
                // this.uploadInput.emit(event);
                break;
            case 'addedToQueue':
                if (typeof output.file !== 'undefined') {
                    this.files.push(output.file);
                }
                break;
            case 'uploading':
                if (typeof output.file !== 'undefined') {
                    // update current data in files array for uploading file
                    const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
                    this.files[index] = output.file;
                }
                break;
            case 'removed':
                // remove file from array when removed
                this.files = this.files.filter((file: UploadFile) => file !== output.file);
                break;
            case 'dragOver':
                this.dragOver = true;
                break;
            case 'dragOut':
            case 'drop':
                this.dragOver = false;
                break;
            case 'done':
                console.log('done');
                console.log(output);
                // The file is downloaded
                break;
        }
    }

    startUpload(): void {
        const request = {
            action: 'dropzone_xls',
            layer: 'native_ajax',
            model_name: this.entity.get_table_name(),
            primary_key: this.entity.get_primary_key(),
            anonymous: false,
            session_key: this.modelService.get_session_key_safe()
        };
        let params = new URLSearchParams();
        for(let key in request){
            params.set(key, request[key])
        }

        const event: UploadInput = {
            type: 'uploadAll',
            url: this.modelService.get_api_url() + '/apps/api/rest.php?' + params.toString(),
            method: 'POST',
            data: { foo: 'bar' }
        };
        this.uploadInput.emit(event);
    }

    cancelUpload(id: string): void {
        this.uploadInput.emit({ type: 'cancel', id: id });
    }

    removeFile(id: string): void {
        this.uploadInput.emit({ type: 'remove', id: id });
    }

    removeAllFiles(): void {
        this.uploadInput.emit({ type: 'removeAll' });
    }

}
