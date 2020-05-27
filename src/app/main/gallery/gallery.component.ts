import { Component, OnInit, Input, ViewChild,TemplateRef, ElementRef, SimpleChange, OnChanges, IterableDiffers, DefaultIterableDiffer } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation, NgxGalleryModule, NgxGalleryComponent } from 'ngx-gallery';
import { ConfirmComponent } from 'app/dialogs/confirm/confirm.component';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModelService } from 'app/_services/model.service';
import { SitebillEntity } from 'app/_models';


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
    gallery_columns = 2;

    //gallery_object: any;
    @ViewChild('gallery_object') gallery_object: ElementRef<NgxGalleryComponent>;

    galleryImages: NgxGalleryImage[];


    @Input("galleryImages")
    galleryImagesInput: NgxGalleryImage[];

    @Input("entity")
    entity: SitebillEntity;

    @Input("image_field")
    image_field: string;

    @Input("disable_gallery_controls")
    disable_gallery_controls: boolean;

    constructor(
        private differs: IterableDiffers,
        public _matDialog: MatDialog,
        private modelSerivce: ModelService,
    ) {
        //this.galleryImages = [];
    }

    recalculate_options() {
        let rows_number_calc_f = this.galleryImages.length / this.gallery_columns;
        this.previous_image_count = this.galleryImages.length;

        let rows_number_calc = Math.ceil(this.galleryImages.length / this.gallery_columns);
        if (rows_number_calc < 1) {
            rows_number_calc = 1;
        }
        let height_calc = rows_number_calc * 100;
        if (this.gallery_object instanceof NgxGalleryComponent) {
            this.gallery_object.options[0].thumbnailsColumns = this.gallery_columns;
            this.gallery_object.options[0].thumbnailsRows = rows_number_calc;
            this.gallery_object.options[0].height = height_calc + 'px';
        }
    }


    ngOnInit(): void {
        this.galleryImages = this.galleryImagesInput[this.image_field];

        this.differ =
            <DefaultIterableDiffer<any>>this.differs.find(this.galleryImages).create();
        let rows_number_calc = Math.ceil(this.galleryImages.length / this.gallery_columns);
        if (rows_number_calc < 1) {
            rows_number_calc = 1;
        }
        let height_calc = rows_number_calc * 200;
        // height_calc = 100;

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
                thumbnailsColumns: this.gallery_columns,
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
                    { icon: 'fa fa-undo fa-sm', onClick: this.rotateRight.bind(this), titleText: 'повернуть против часовой стрелки' },
                    { icon: 'fa fa-repeat fa-sm', onClick: this.rotateLeft.bind(this), titleText: 'повернуть по часовой стрелке' },
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
                preview: true
            }
        ];

        if ( this.entity.get_readonly() ) {
            try {
                this.galleryOptions[0].preview = false;
                this.galleryOptions[0].image = true;
                this.galleryOptions[0].thumbnails = false;
                this.galleryOptions[0].imageSwipe = true;
                delete (this.galleryOptions[0].thumbnailActions);
            } catch (e) {

            }
        }

        if ( this.disable_gallery_controls  ) {
            try {
                delete (this.galleryOptions[0].thumbnailActions);
            } catch (e) {

            }
        }
    }

    deleteImage(event, index) {
        this.confirmDialogRef = this._matDialog.open(ConfirmComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Вы уверены, что хотите удалить фото?';
        //this.confirmDialogRef.componentInstance.;

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.modelSerivce.deleteImage(this.entity.get_table_name(), this.entity.primary_key, this.entity.key_value, index, this.image_field)
                    .subscribe((result: any) => {
                        this.galleryImages.splice(index, 1);
                        this.recalculate_options();
                    });
            }
            this.confirmDialogRef = null;
        });
    }


    enable_move() {
    }

    moveRight(event, index) {
        this.modelSerivce.reorderImage(this.entity.get_table_name(), this.entity.primary_key, this.entity.key_value, index, 'down', this.image_field)
            .subscribe((result: any) => {
                let tmp_images = this.array_move(this.galleryImages, index, index + 1);
                this.galleryImages = [];
                setTimeout(() => this.reorder(tmp_images), 10);
            });

    }
    moveLeft(event, index) {
        this.modelSerivce.reorderImage(this.entity.get_table_name(), this.entity.primary_key, this.entity.key_value, index, 'up', this.image_field)
            .subscribe((result: any) => {
                let tmp_images = this.array_move(this.galleryImages, index, index - 1);
                this.galleryImages = [];
                setTimeout(() => this.reorder(tmp_images), 1);
            });

    }
    moveToStart(event, index) {
        this.modelSerivce.reorderImage(this.entity.get_table_name(), this.entity.primary_key, this.entity.key_value, index, 'make_main', this.image_field)
            .subscribe((result: any) => {
                let tmp_images = this.array_move(this.galleryImages, index, 0);
                this.galleryImages = [];
                setTimeout(() => this.reorder(tmp_images), 1);
            });

    }

    rotateLeft(event, index) {
        this.modelSerivce.rotateImage(this.entity.get_table_name(), this.entity.primary_key, this.entity.key_value, index, 'acw', this.image_field)
            .subscribe((result: any) => {
                let tmp_images = this.add_timestamp_prefix(this.galleryImages);
                this.galleryImages = [];
                setTimeout(() => this.reorder(tmp_images), 1);
            });

    }

    rotateRight(event, index) {
        this.modelSerivce.rotateImage(this.entity.get_table_name(), this.entity.primary_key, this.entity.key_value, index, 'ccw', this.image_field)
            .subscribe((result: any) => {
                let tmp_images = this.add_timestamp_prefix(this.galleryImages);
                this.galleryImages = [];
                setTimeout(() => this.reorder(tmp_images), 1);
            });

    }

    add_timestamp_prefix(images) {
        if (images) {
            return images.map(function (image: any) {

                return {
                    small: image.small + '?' + new Date().getTime(),
                    medium: image.medium + '?' + new Date().getTime(),
                    big: image.big + '?' + new Date().getTime()
                };
            });
        }
        return [];
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
