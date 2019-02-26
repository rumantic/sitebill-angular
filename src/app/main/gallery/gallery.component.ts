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

    //gallery_object: any;
    @ViewChild('gallery_object') gallery_object: ElementRef<NgxGalleryComponent>;

    @Input("galleryImages")
    galleryImages: NgxGalleryImage[];
    constructor(private differs: IterableDiffers) {
        //this.galleryImages = [];
    }


    ngOnInit(): void {
        this.differ =
            <DefaultIterableDiffer<any>>this.differs.find(this.galleryImages).create();
        let rows_number_calc = Math.ceil(this.galleryImages.length / 4);
        if (rows_number_calc < 1) {
            rows_number_calc = 1;
        }
        let height_calc = rows_number_calc * 100;


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
                    { icon: 'fa fa-chevron-left fa-sm', onClick: this.deleteImage.bind(this), titleText: 'выше' },
                    { icon: 'fa fa-times-circle fa-sm', onClick: this.deleteImage.bind(this), titleText: 'удалить' },
                    { icon: 'fa fa-chevron-right fa-sm', onClick: this.deleteImage.bind(this), titleText: 'ниже' },
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

    deleteImage() {

        this.moveToEnd();
    }

    ngDoCheck() {
        //console.log(this.galleryImages);
        if (this.galleryImages ) {
            let changes = this.differ.diff(this.galleryImages);
            if (changes != null) {
                this.galleryImages
                setTimeout(() => this.moveToEnd(), 10);
            }

        }
    }



    moveToEnd() {
        if (this.gallery_object instanceof NgxGalleryComponent ) {
            while (this.gallery_object.canMoveThumbnailsRight()) {
                this.gallery_object.moveThumbnailsRight();
            }
        }
    }
}