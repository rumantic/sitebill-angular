import { Component, OnInit, Input, ViewChild,TemplateRef, ElementRef, SimpleChange, OnChanges, IterableDiffers, DefaultIterableDiffer } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation, NgxGalleryModule, NgxGalleryComponent } from 'ngx-gallery';

@Component({
    selector: 'gallery-component',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
    galleryOptions: NgxGalleryOptions[];
    private differ: DefaultIterableDiffer<any>;
    public can_move: boolean;

    //gallery_object: any;
    @ViewChild('gallery_object') gallery_object: ElementRef<NgxGalleryComponent>;

    @Input("galleryImages")
    galleryImages: NgxGalleryImage[];
    constructor(private differs: IterableDiffers) {
        //this.galleryImages = [];
        this.can_move = true;
    }


    ngOnInit(): void {
        this.differ =
            <DefaultIterableDiffer<any>>this.differs.find(this.galleryImages).create();
        let rows_number_calc = Math.ceil(this.galleryImages.length / 4);
        if (rows_number_calc < 1) {
            rows_number_calc = 1;
        }
        let height_calc = rows_number_calc * 100;

        console.log('init');
        console.log(this.galleryImages);

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
                    { icon: 'fa fa-star fa-sm', onClick: this.deleteImage.bind(this), titleText: 'сделать главной' },
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
        this.can_move = false;
        this.galleryImages.splice(index, 1);
        setTimeout(() => this.enable_move(), 1);

    }
    enable_move() {
        this.can_move = true;
    }

    moveRight(event, index) {
        this.can_move = false;
        let tmp_images = this.array_move(this.galleryImages, index, index+1);
        this.galleryImages = [];
        setTimeout(() => this.reorder(tmp_images), 10);
        setTimeout(() => this.enable_move(), 1);
    }
    moveLeft(event, index) {
        this.can_move = false;
        let tmp_images = this.array_move(this.galleryImages, index, index - 1);
        this.galleryImages = [];
        setTimeout(() => this.reorder(tmp_images), 1);
        setTimeout(() => this.enable_move(), 1);
    }


    reorder(tmp_images) {
        this.galleryImages = tmp_images;
    }

    array_move(arr, old_index, new_index) {
        console.log(arr.length);
        console.log(new_index);
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
            if (changes != null && this.can_move) {
                this.galleryImages
                setTimeout(() => this.moveToEnd(), 10);
            }

        }
    }



    moveToEnd() {
        if (this.gallery_object instanceof NgxGalleryComponent) {
            console.log('move to end');
            while (this.gallery_object.canMoveThumbnailsRight()) {
                this.gallery_object.moveThumbnailsRight();
            }
        }
    }
}