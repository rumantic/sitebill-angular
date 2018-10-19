import {Component, Inject, OnInit, isDevMode, ChangeDetectionStrategy, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {FuseConfigService} from '@fuse/services/config.service';
import {ActivatedRoute} from '@angular/router';

import {currentUser} from 'app/_models/currentuser';
import {IImage} from 'ng-simple-slideshow';
import {NguCarouselConfig} from '@ngu/carousel';


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

    private _unsubscribeAll: Subject<any>;
    private currentUser: currentUser;

    imgags = [
        'https://s3.envato.com/files/255283297/item-logo.png',
        'https://s3.envato.com/files/255283297/item-logo.png',
        'https://s3.envato.com/files/255283297/item-logo.png',
        'https://s3.envato.com/files/255283297/item-logo.png'
    ];

    public carouselTileItems: Array<any> = [0, 1, 2, 3, 4, 5];
    public carouselTiles = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: []
    };
    public carouselTile: NguCarouselConfig = {
        grid: {xs: 1, sm: 1, md: 3, lg: 3, all: 0},
        slide: 3,
        speed: 250,
        point: {
            visible: true
        },
        load: 2,
        velocity: 0,
        touch: true,
        easing: 'cubic-bezier(0, 0, 0.2, 1)'
    };

    constructor(
        private route: ActivatedRoute,
        private _httpClient: HttpClient,
        private _fuseConfigService: FuseConfigService,
        private _cdr: ChangeDetectorRef
    ) {

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


        this.controlPressed = false;
        this.controlProcessing = true;
    }
    ngAfterViewInit() {
        this._cdr.detectChanges();
    }

    ngOnInit() {
        this.load_grid_data('data', {active: 1, user_id: 226}, ['id', 'city_id', 'country_id', 'street_id', 'number', 'price', 'currency_id', 'image']);
        this.load_grid_data('complex', {active: 1}, ['complex_id', 'name', 'url', 'image']);
        this.carouselTileItems.forEach(el => {
            this.carouselTileLoad(el);
        });

    }

    public carouselTileLoad(j) {
        // console.log(this.carouselTiles[j]);
        const len = this.carouselTiles[j].length;
        if (len <= 30) {
            for (let i = len; i < len + 15; i++) {
                this.carouselTiles[j].push(
                    this.imgags[Math.floor(Math.random() * this.imgags.length)]
                );
            }
        }
    }

    load_grid_data(app_name, params: any, grid_item) {
        //console.log('load_grid_data');
        //console.log(params);
        const body = {action: 'model', anonymous: true, do: 'get_data', model_name: app_name, params: params, session_key: this.currentUser.session_key, grid_item: grid_item};
        //console.log(body);

        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, body)
            .subscribe((result: any) => {
                //console.log(result);
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
            //console.log('key');
            //console.log(key);
            //console.log('rows');
            //console.log(rows);
            //console.log('rows[key][\'image\'][\'value\']');
            //console.log(rows[key]['image']['value']);

            console.log('rows[key]');
            console.log(rows[key]);
            key_item = rows[key];

            //console.log('key_item');
            //console.log(key_item);


            image_items = key_item['image'];
            //console.log('image_items');
            //console.log(image_items);

            if (typeof image_items[0] === 'undefined') {
                value_items = image_items['value'];

                //console.log('value_items 111');
                //console.log(value_items);
                //console.log(value_items.lehgth);
                value_zero = value_items[0];
            } else {
                old_style = true;
                value_zero = image_items[0];
            }

            //console.log('value_zero');
            //console.log(value_zero);

            normal = value_zero['normal'];

            //console.log('normal');
            //console.log(normal);

            //console.log(value_items);

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
                let slide_item = {url: img_url, caption: caption, href: href};
                console.log(slide_item);
                this.imageUrls.push(slide_item);
            }
        }
    }
}
