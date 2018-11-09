import {Component, Inject, OnInit, isDevMode} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {FuseConfigService} from '@fuse/services/config.service';
import {ActivatedRoute} from '@angular/router';
import {coerceNumberProperty} from '@angular/cdk/coercion';

import {currentUser} from 'app/_models/currentuser';
import {IImage} from 'ng-simple-slideshow';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
    selector: 'search',
    templateUrl: './search-form.component.html',
    styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {
    controlPressed: boolean;
    controlProcessing: boolean;
    key_value: any;
    model_name: any;
    control_name: any;
    item_model: any[];
    item: any[];
    
    form: FormGroup;
    


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
    
    private _tickInterval = 1;
    autoTicks = false;
    disabled = false;
    invert = false;
    max = 100;
    min = 0;
    showTicks = false;
    step = 1;
    thumbLabel = true;
    value = 0;
    vertical = false;
    
    realty_price = 5500000;
    step_realty_price = 10000;
    max_realty_price = 20000000;
    min_realty_price = 10000;
    

    private _unsubscribeAll: Subject<any>;
    private currentUser: currentUser;

    constructor(
        private route: ActivatedRoute,
        private _httpClient: HttpClient,
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder
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


    ngOnInit() {
        // Reactive Form
        this.form = this._formBuilder.group({
            company   : [
                {
                    value   : 'Google',
                    disabled: true
                }, Validators.required
            ],
            firstName : ['', Validators.required],
            lastName  : ['', Validators.required],
            address   : ['', Validators.required],
            address2  : ['', Validators.required],
            city      : ['', Validators.required],
            state     : ['', Validators.required],
            postalCode: ['', [Validators.required, Validators.maxLength(5)]],
            country   : ['', Validators.required],
            realty_price : ['', Validators.required],
        });
        
        //this.load_grid_data('data', {active: 1, user_id: 226}, ['id', 'city_id', 'country_id', 'street_id', 'number', 'price', 'currency_id', 'image'])
        //this.load_grid_data('complex', {active: 1}, ['complex_id', 'name', 'url', 'image'])

    }
    
    formatLabel(value: number | null) {
        if (!value) {
            return 0;
        }

        if (value >= 1000) {
            return value / 1000000 + ' млн';
        }

        return value;
    }
    
    get tickInterval(): number | 'auto' {
        return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
    }
    set tickInterval(value) {
        this._tickInterval = coerceNumberProperty(value);
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
    calculate(event) {
        console.log('calculate');
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
                    if ( old_style ) {
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
