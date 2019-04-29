import { Component, EventEmitter, Input, isDevMode, Inject } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, UploadStatus } from 'ngx-uploader';
import { NgxGalleryImage } from 'ngx-gallery';
import { SitebillEntity } from 'app/_models';
import { ModelService } from 'app/_services/model.service';
import { AppConfig, APP_CONFIG } from 'app/app.config.module';
import { currentUser } from 'app/_models/currentuser';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmComponent } from 'app/dialogs/confirm/confirm.component';
import { SnackService } from 'app/_services/snack.service';

export class UploadResult {
    state: string;
    data: any[];
    message: any[];
}

@Component({
    selector: 'uploader-component',
    templateUrl: 'uploader.component.html',
    styleUrls: ['uploader.component.sass']
})
export class UploaderComponent {
    url: string;
    api_url: string;
    formData: FormData;
    files: UploadFile[];
    uploadInput: EventEmitter<UploadInput>;
    confirmDialogRef: MatDialogRef<ConfirmComponent>;

    humanizeBytes: Function;
    dragOver: boolean;
    options: UploaderOptions;
    queue_size: number =  0;

    @Input("galleryImages")
    galleryImages: NgxGalleryImage[];

    @Input("entity")
    entity: SitebillEntity;

    @Input("image_field")
    image_field: string;

    @Input("max_uploads")
    max_uploads: any;


    protected currentUser: currentUser;


    constructor(
        private modelSerivce: ModelService,
        public _matDialog: MatDialog,
        private _snackService: SnackService,
        @Inject(APP_CONFIG) private config: AppConfig,
    ) {
        if (isDevMode()) {
            this.api_url = this.config.apiEndpoint;
        } else {
            this.api_url = '';
        }
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];

        this.files = [];
        this.uploadInput = new EventEmitter<UploadInput>();
        this.humanizeBytes = humanizeBytes;
    }

    ngOnInit() {
        if (this.max_uploads == null) {
            this.max_uploads = 100;
        }
        this.options = { concurrency: 1, maxUploads: this.max_uploads };

        this.url = this.api_url + '/apps/api/rest.php?uploader_type=dropzone&element='
            + this.image_field
            + '&model=' + this.entity.get_table_name()
            + '&layer=native_ajax'
            + '&is_uploadify=1'
            + '&primary_key_value=' + this.entity.primary_key
            + '&primary_key=' + this.entity.key_value
            + '&session_key=' + this.currentUser.session_key;
    }

    onUploadOutput(output: UploadOutput): void {
        //console.log('upload event');
        //console.log(output.type);
        if (output.type === 'allAddedToQueue') {
            const event: UploadInput = {
                type: 'uploadAll',
                url: this.url,
                method: 'POST',
                data: { foo: 'bar' }
            };
            this.queue_size = this.files.length;

            this.uploadInput.emit(event);

        } else if (output.type === 'done' && typeof output.file !== 'undefined') {
            this.queue_size--;
            //console.log(this.entity);
            if (this.queue_size == 0) {
                if (this.entity.key_value == null) {
                    this.modelSerivce.new_empty_record(this.entity.get_table_name())
                        .subscribe((result: UploadResult) => {
                            if (result.state == 'error') {
                                this._snackService.message('Невозможно загрузить фото к новой записи. Сначала сохраните запись без фото, а потом загрузите к ней фото.', 5000);
                                return false;
                            }
                            if (result.message[this.entity.primary_key]['value'] != null ) {
                                this.entity.key_value = result.message[this.entity.primary_key]['value'];
                                this.modelSerivce.entity.key_value = this.entity.key_value;
                                //console.log(result.message);

                                for (var prop in result.message[this.image_field]['value']) {

                                    let gallery_image = {
                                        small: this.api_url + '/img/data/' + result.message[this.image_field]['value'][prop].preview + '?' + new Date().getTime(),
                                        medium: this.api_url + '/img/data/' + result.message[this.image_field]['value'][prop].normal + '?' + new Date().getTime(),
                                        big: this.api_url + '/img/data/' + result.message[this.image_field]['value'][prop].normal + '?' + new Date().getTime(),
                                    };
                                    this.galleryImages[this.image_field].push(gallery_image);
                                }
                            }


                            //this.uppend_uploads();
                        });

                } else {
                    this.uppend_uploads();
                }

            }
 

        } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
            this.files.push(output.file);
        } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
            const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
            this.files[index] = output.file;
        } else if (output.type === 'cancelled' || output.type === 'removed') {
            this.files = this.files.filter((file: UploadFile) => file !== output.file);
        } else if (output.type === 'dragOver') {
            this.dragOver = true;
        } else if (output.type === 'dragOut') {
            this.dragOver = false;
        } else if (output.type === 'drop') {
            this.dragOver = false;
        } else if (output.type === 'rejected' && typeof output.file !== 'undefined') {
            console.log(output.file.name + ' rejected');
        }

        this.files = this.files.filter(file => file.progress.status !== UploadStatus.Done);
    }

    uppend_uploads() {
        this.modelSerivce.uppend_uploads(this.entity.get_table_name(), this.entity.primary_key, this.entity.key_value, this.image_field)
            .subscribe((result: UploadResult) => {
                console.log(result);

                let prefix = '';
                if (this.entity.get_table_name() == 'user') {
                    prefix = 'user/';
                }

                for (var prop in result.data) {
                    let gallery_image = {
                        small: this.api_url + '/img/data/' + prefix + result.data[prop].preview + '?' + new Date().getTime(),
                        medium: this.api_url + '/img/data/' + prefix + result.data[prop].normal + '?' + new Date().getTime(),
                        big: this.api_url + '/img/data/' + prefix + result.data[prop].normal + '?' + new Date().getTime(),
                    };
                    this.galleryImages[this.image_field].push(gallery_image);
                }
            });
    }

    delete_all_images() {
        this.confirmDialogRef = this._matDialog.open(ConfirmComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Вы уверены, что хотите удалить все фото?';
        //this.confirmDialogRef.componentInstance.;

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.modelSerivce.deleteAllImages(this.entity.get_table_name(), this.entity.primary_key, this.entity.key_value, this.image_field)
                    .subscribe((result: any) => {
                        this.galleryImages[this.image_field] = [];
                        //console.log(this.galleryImages);
                        //this.recalculate_options();
                    });
            }
            this.confirmDialogRef = null;
        });
    }

    startUpload(): void {
        const event: UploadInput = {
            type: 'uploadAll',
            url: this.url,
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