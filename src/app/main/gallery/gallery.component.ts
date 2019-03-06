import { Component, OnInit, Input, ViewChild,TemplateRef, ElementRef, SimpleChange, OnChanges, IterableDiffers, DefaultIterableDiffer } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation, NgxGalleryModule, NgxGalleryComponent } from 'ngx-gallery';
import { ConfirmComponent } from 'app/dialogs/confirm/confirm.component';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatDialogRef } from '@angular/material';


@Component({
    selector: 'gallery-component',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
    animations: fuseAnimations
})
export class GalleryComponent implements OnInit {
    galleryOptions: NgxGalleryOptions[];
    private differ: DefaultIterableDiffer<any>;
    public previous_image_count: number;
    confirmDialogRef: MatDialogRef<ConfirmComponent>;

    //gallery_object: any;
    @ViewChild('gallery_object') gallery_object: ElementRef<NgxGalleryComponent>;

    @Input("galleryImages")
    galleryImages: NgxGalleryImage[];
    constructor(
        private differs: IterableDiffers,
        public _matDialog: MatDialog
    ) {
        //this.galleryImages = [];
    }

    recalculate_options() {
        let rows_number_calc_f = this.galleryImages.length / 4;
        this.previous_image_count = this.galleryImages.length;

        let rows_number_calc = Math.ceil(this.galleryImages.length / 4);
        if (rows_number_calc < 1) {
            rows_number_calc = 1;
        }
        let height_calc = rows_number_calc * 100;
        if (this.gallery_object instanceof NgxGalleryComponent) {
            this.gallery_object.options[0].thumbnailsColumns = 4;
            this.gallery_object.options[0].thumbnailsRows = rows_number_calc;
            this.gallery_object.options[0].height = height_calc + 'px';
        }
    }


    ngOnInit(): void {
        this.differ =
            <DefaultIterableDiffer<any>>this.differs.find(this.galleryImages).create();
        let rows_number_calc = Math.ceil(this.galleryImages.length / 4);
        if (rows_number_calc < 1) {
            rows_number_calc = 1;
        }
        let height_calc = rows_number_calc * 100;
        this.previous_image_count = this.galleryImages.length;


        this.galleryOptions = [
            {
                width: '100%',
                height: height_calc + 'px',
                image: false,
                "arrowPrevIcon": "fa fa-arrow-circle-o-left",
                "arrowNextIcon": "fa fa-arrow-circle-o-right",
                "closeIcon": "fa fa-window-close",
                "fullscreenIcon": "fa fa-arrows",
                "spinnerIcon": "fa fa-refresh fa-spin fa-3x fa-fw",
                "previewFullscreen": true,
                "thumbnailsOrder": 2,
                thumbnailsColumns: 4,
                thumbnailsRows: rows_number_calc,
                previewCloseOnClick: true,
                imageBullets: true,
                imageInfinityMove: true,
                imageAnimation: NgxGalleryAnimation.Slide,
                thumbnailActions: [
                    { icon: 'fa fa-chevron-left fa-sm', onClick: this.moveLeft.bind(this), titleText: 'выше' },
                    { icon: 'fa fa-times-circle fa-sm', onClick: this.deleteImage.bind(this), titleText: 'удалить' },
                    { icon: 'fa fa-chevron-right fa-sm', onClick: this.moveRight.bind(this), titleText: 'ниже' },
                    { icon: 'fa fa-star fa-sm', onClick: this.moveToStart.bind(this), titleText: 'сделать главной' },
                ]
            },
            // max-width 800
            {
                breakpoint: 800,
                width: '100%',
                height: '600px',
                previewCloseOnClick: true,
                imageBullets: true,
                imageInfinityMove: true,
                imagePercent: 80,
                thumbnailsPercent: 20,
                thumbnailsMargin: 20,
                thumbnailMargin: 20
            },
            // max-width 400
            {
                breakpoint: 400,
                imageBullets: true,
                previewCloseOnClick: true,
                imageInfinityMove: true,
                preview: false
            }
        ];

    }

    deleteImage(event, index) {
        this.confirmDialogRef = this._matDialog.open(ConfirmComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Вы уверены, что хотите удалить фото?';
        //this.confirmDialogRef.componentInstance.;

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.galleryImages.splice(index, 1);
                this.recalculate_options();
            }
            this.confirmDialogRef = null;
        });

    }
    enable_move() {
    }

    moveRight(event, index) {
        let tmp_images = this.array_move(this.galleryImages, index, index+1);
        this.galleryImages = [];
        setTimeout(() => this.reorder(tmp_images), 10);
    }
    moveLeft(event, index) {
        let tmp_images = this.array_move(this.galleryImages, index, index - 1);
        this.galleryImages = [];
        setTimeout(() => this.reorder(tmp_images), 1);
    }
    moveToStart(event, index) {
        let tmp_images = this.array_move(this.galleryImages, index, 0);
        this.galleryImages = [];
        setTimeout(() => this.reorder(tmp_images), 1);
    }


    reorder(tmp_images) {
        this.galleryImages = tmp_images;
    }

    array_move(arr, old_index, new_index) {
        if (new_index < 0) {
            return arr;
        }
        if (arr.length <= new_index) {
            return arr;
        }
        while (old_index < 0) {
            old_index += arr.length;
        }
        while (new_index < 0) {
            new_index += arr.length;
        }
        if (new_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);

        return arr; // for testing purposes
    }

    ngDoCheck() {
        //console.log(this.galleryImages);
        if (this.galleryImages ) {
            let changes = this.differ.diff(this.galleryImages);
            if (changes != null && this.previous_image_count < changes.length) {
                this.recalculate_options();
                setTimeout(() => this.moveToEnd(), 10);
                this.previous_image_count = changes.length;
            }

        }
    }



    moveToEnd() {
        if (this.gallery_object instanceof NgxGalleryComponent) {
            while (this.gallery_object.canMoveThumbnailsRight()) {
                this.gallery_object.moveThumbnailsRight();
            }
        }
    }
}