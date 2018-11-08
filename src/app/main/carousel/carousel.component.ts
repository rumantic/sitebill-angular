import {Component, Inject, OnInit, isDevMode, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {FuseConfigService} from '@fuse/services/config.service';
import {ActivatedRoute} from '@angular/router';

import {currentUser} from 'app/_models/currentuser';
import {IImage} from 'ng-simple-slideshow';
import {NguCarousel, NguCarouselConfig, NguCarouselStore} from '@ngu/carousel';

import {DOCUMENT} from '@angular/platform-browser';

@Component({
    selector: 'carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselComponent implements OnInit {
    controlPressed: boolean;
    controlProcessing: boolean;
    key_value: any;
    model_name: any;
    control_name: any;
    item_model: any[];
    item: any[];


    rows: any[];
    records: any[];
    api_url: string;

    imageUrls: (string | IImage)[] = [];
    height: string = '100%';
    minHeight: string = '200px';
    arrowSize: string = '30px';
    showArrows: boolean = true;
    disableSwiping: boolean = false;
    autoPlay: boolean = true;
    autoPlayInterval: number = 3333;
    stopAutoPlayOnSlide: boolean = true;
    debug: boolean = false;
    backgroundSize: string = 'cover';
    backgroundPosition: string = 'center center';
    backgroundRepeat: string = 'no-repeat';
    showDots: boolean = false;
    dotColor: string = '#FFF';
    showCaptions: boolean = true;
    captionColor: string = '#FFF';
    captionBackground: string = 'rgba(0, 0, 0, .35)';
    lazyLoad: boolean = true;
    hideOnNoSlides: boolean = false;
    width: string = '100%';
    loaded_items: boolean = false;

    private _unsubscribeAll: Subject<any>;
    private currentUser: currentUser;


    name = 'Angular';
    slideNo = 0;
    withAnim = true;
    resetAnim = true;

    @ViewChild('myCarousel') myCarousel: NguCarousel<any>;
    carouselConfig: NguCarouselConfig = {
        grid: {xs: 1, sm: 1, md: 5, lg: 5, all: 0},
        load: 1,
        interval: {timing: 4000, initialDelay: 1000},
        loop: true,
        touch: true,
        velocity: 0.2
    }
    carouselItems = [0, 1, 2, 3, 4, 5];
    property = [
        {img_url: null, caption: null, href: null},
        {img_url: null, caption: null, href: null},
        {img_url: null, caption: null, href: null},
        {img_url: null, caption: null, href: null},
        {img_url: null, caption: null, href: null},
    ];

    constructor(
        private route: ActivatedRoute,
        private _httpClient: HttpClient,
        private _fuseConfigService: FuseConfigService,
        @Inject(DOCUMENT) private document: any,
        private _cdr: ChangeDetectorRef
    ) {
        //console.log(this.property);

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];
        if (isDevMode()) {
            this.api_url = 'http://genplan1';
        } else {
            this.api_url = '';
        }
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                }
            }
        };

        this.model_name = this.route.snapshot.paramMap.get('model_name');
        this.control_name = this.route.snapshot.paramMap.get('control_name');
        this.key_value = this.route.snapshot.paramMap.get('id');
        console.log(this.document);


        this.controlPressed = false;
        this.controlProcessing = true;
    }
    

    ngOnInit() {
        this.load_grid_data('complex', {active: 1}, ['complex_id', 'name', 'url', 'image']);
        this.load_grid_data('data', {active: 1, user_id: 226}, ['id', 'city_id', 'country_id', 'street_id', 'number', 'price', 'currency_id', 'image']);
    }
    ngAfterViewInit() {
        this._cdr.detectChanges();
    }

    reset() {
        this.myCarousel.reset(!this.resetAnim);
    }

    moveTo(slide) {
        this.myCarousel.moveTo(slide, !this.withAnim);
    }
    
    after_load_items() {
        this.loaded_items = true;
        //console.log(this.property);
        this._cdr.detectChanges();
    }
    
    load_grid_data(app_name, params: any, grid_item) {
        const body = {action: 'model', anonymous: true, do: 'get_data', model_name: app_name, params: params, session_key: this.currentUser.session_key, grid_item: grid_item};
        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, body)
            .subscribe((result: any) => {
                this.init_data_slides(app_name, result.rows);
            });
    }

    init_data_slides(app_name, rows) {
        var image_items;
        var key_item;
        var value_items;
        var value_zero;
        var normal;
        var caption;
        var href;
        var caption_array = [];
        var old_style = false;

        for (let key in rows) {
            key_item = rows[key];
            image_items = key_item['image'];
            if (typeof image_items[0] === 'undefined') {
                value_items = image_items['value'];
                value_zero = value_items[0];
            } else {
                old_style = true;
                value_zero = image_items[0];
            }
            normal = value_zero['normal'];


            if (typeof normal === 'undefined') {
                console.log('undefined');
            } else {
                let img_url = `${this.api_url}/img/data/` + normal;
                if (app_name == 'complex') {
                    if (!old_style) {
                        caption = rows[key]['name']['value'];
                        href = '/complex/' + rows[key]['url']['value'] + '/';
                    } else {
                        caption = rows[key]['name'];
                        href = '/complex/' + rows[key]['url'] + '/';
                    }
                } else {
                    caption_array = [];
                    if (rows[key]['country_id']['value_string'] !== null && rows[key]['country_id']['value_string'] != '') {
                        caption_array.push(rows[key]['country_id']['value_string']);
                    }

                    if (rows[key]['city_id']['value_string'] !== null && rows[key]['city_id']['value_string'] != '') {
                        caption_array.push(rows[key]['city_id']['value_string']);
                    }

                    if (rows[key]['street_id']['value_string'] !== null && rows[key]['street_id']['value_string'] != '') {
                        caption_array.push(rows[key]['street_id']['value_string']);
                    }
                    if (old_style) {
                        caption_array.push(rows[key]['price'] + ' ' + rows[key]['currency_id']['value_string']);
                        href = '/realty' + rows[key]['id'];
                    } else {
                        caption_array.push(rows[key]['price']['value'] + ' ' + rows[key]['currency_id']['value_string']);
                        href = '/realty' + rows[key]['id']['value'];
                    }


                    caption = caption_array.join(", ");
                }
                let slide_item = {img_url: img_url, caption: caption, href: href};
                this.property[key] = slide_item;
                //this.property[key]['href'] = href;
                this.carouselItems[key] = caption;
            }
        }
        this.after_load_items();
    }
}
