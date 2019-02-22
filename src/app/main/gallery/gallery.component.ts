import { Component, OnInit, Input, ViewChild,TemplateRef, ElementRef, SimpleChange, OnChanges, IterableDiffers, DefaultIterableDiffer } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
    selector: 'gallery-component',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
    galleryOptions: NgxGalleryOptions[];
    private differ: DefaultIterableDiffer<any>;

    //gallery_object: any;
    @ViewChild('gallery_object') gallery_object: ElementRef;

    @Input("galleryImages")
    galleryImages: NgxGalleryImage[];
    constructor(private differs: IterableDiffers) {
        //this.galleryImages = [];
    }


    ngOnInit(): void {
        this.differ =
            <DefaultIterableDiffer<any>>this.differs.find(this.galleryImages).create();


        this.galleryOptions = [
            {
                width: '100%',
                height: '400px',
                thumbnailsColumns: 7,
                previewCloseOnClick: true,
                imageBullets: true,
                imageInfinityMove: true,
                imageAnimation: NgxGalleryAnimation.Slide,
                thumbnailActions: [{ icon: 'fa fa-times-circle', onClick: this.deleteImage.bind(this), titleText: 'delete' }]
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
        console.log('delete image');
        this.moveToEnd();
    }

    ngDoCheck() {
        //console.log(this.galleryImages);
        if (this.galleryImages ) {
            let changes = this.differ.diff(this.galleryImages);
            if (changes != null) {
                setTimeout(() => this.moveToEnd(), 10);
            }

        }
    }



    moveToEnd() {
        if (this.gallery_object) {
            while (this.gallery_object.canMoveThumbnailsRight()) {
                this.gallery_object.moveThumbnailsRight();
            }
        }
    }
}