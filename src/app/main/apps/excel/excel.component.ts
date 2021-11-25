import {Component, EventEmitter, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {fuseAnimations} from '../../../../@fuse/animations';
import {ModelService} from '../../../_services/model.service';
import {SnackService} from '../../../_services/snack.service';
import {SitebillEntity, SitebillModelItem} from "../../../_models";
import {UploaderOptions, UploadFile, UploadInput, humanizeBytes, UploadOutput} from "ngx-uploader";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

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
    protected _unsubscribeAll: Subject<any>;


    @Input("entity")
    entity: SitebillEntity;

    onSave = new EventEmitter();
    excel_columns = [];
    excel_rows: any;
    mapped_columns = {};
    mapped_model_titles = {};
    public mapped_columns_array: any[];

    constructor(
        protected modelService: ModelService,
        protected _snackService: SnackService,
    ) {
        this._unsubscribeAll = new Subject();

        this.options = { concurrency: 1, maxUploads: 3, maxFileSize: 1000000 };
        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;
    }


    ngOnInit() {
        console.log(this.entity);
        let index = 0;
        for (const [key_obj, value_obj] of Object.entries(this.entity.model)) {
            this.mapped_model_titles[index] = value_obj.title;
            index++;
            this.excel_columns.push({
                title: value_obj.title,
                prop: value_obj.title,
                //cellTemplate: this.rowTemplate,
            });
        }
        console.log(this.mapped_model_titles);
    }


    colName(n) {
        let ordA = 'a'.charCodeAt(0);
        let ordZ = 'z'.charCodeAt(0);
        let len = ordZ - ordA + 1;

        let s = "";
        while(n >= 0) {
            s = String.fromCharCode(n % len + ordA) + s;
            n = Math.floor(n / len) - 1;
        }
        return s.toUpperCase();
    }


    onUploadOutput(output: UploadOutput): void {
        switch (output.type) {
            case 'allAddedToQueue':
                this.startUpload();
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
                this.startParse(output.file.response.file);
                break;
        }
    }

    startParse ( file_name ) {
        const request = {
            action: 'dropzone_xls',
            layer: 'native_ajax',
            do: 'parse_xls_json',
            file_name: file_name,
            model_name: this.entity.get_table_name(),
            primary_key: this.entity.get_primary_key(),
            anonymous: false,
            session_key: this.modelService.get_session_key_safe()
        };
        this.modelService.api_request(request)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                if (result) {
                    this.mapped_columns = this.mapper(result.excel_data);
                    this.mapped_columns_array = this.mapper_array(result.excel_data);
                    this.prepareTableData(result.excel_data);
                }
            });
    }

    mapper ( rows ) {
        let hashmap = rows[0];

        let ret = {};
        for(let key in hashmap){
            ret[hashmap[key]] = key;
        }

        console.log(ret);
        return ret;
    }
    mapper_array ( rows ) {
        let hashmap = rows[0];

        let ret = [];
        for(let key in hashmap){
            ret.push({
                letter: key,
                title: hashmap[key]
            });
        }
        console.log(ret);
        return ret;
    }

    prepareTableData ( data ) {
        this.excel_rows = data;
        console.log(data);

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

    OnDestroy () {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
