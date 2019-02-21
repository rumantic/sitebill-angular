import { Component, EventEmitter } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, UploadStatus } from 'ngx-uploader';
import { NgxGalleryImage } from 'ngx-gallery';


@Component({
    selector: 'uploader-component',
    templateUrl: 'uploader.component.html',
    styleUrls: ['uploader.component.sass']
})
export class UploaderComponent {
    url = 'http://genplan1/apps/system/js/uploadify/uploadify.php?uploader_type=dropzone&element=image&model=data&primary_key_value=id&primary_key=1';
    formData: FormData;
    files: UploadFile[];
    uploadInput: EventEmitter<UploadInput>;
    humanizeBytes: Function;
    dragOver: boolean;
    options: UploaderOptions;
    galleryImages: NgxGalleryImage[];


    constructor() {
        this.options = { concurrency: 1, maxUploads: 100 };
        this.files = [];
        this.uploadInput = new EventEmitter<UploadInput>();
        this.humanizeBytes = humanizeBytes;
    }

    ngOnInit() {
        this.galleryImages = [];

    }

    onUploadOutput(output: UploadOutput): void {
        console.log(output);
        if (output.type === 'allAddedToQueue') {
            const event: UploadInput = {
                type: 'uploadAll',
                url: this.url,
                method: 'POST',
                data: { foo: 'bar' }
            };

            this.uploadInput.emit(event);
        } else if (output.type === 'done' && typeof output.file !== 'undefined') {
            let gallery_image = {
                small: 'http://genplan1'+output.file.response.msg,
                medium: 'http://genplan1' + output.file.response.msg,
                big: 'http://genplan1' + output.file.response.msg
            };
            this.galleryImages.push(gallery_image);

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