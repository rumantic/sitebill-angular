import {Component, Inject, OnInit, isDevMode} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {FuseConfigService} from '@fuse/services/config.service';
import {ActivatedRoute} from '@angular/router';

import {currentUser} from 'app/_models/currentuser';
import {IImage} from 'ng-simple-slideshow';


@Component({
    selector: 'slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {
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
    height: string = '400px';
    minHeight: string;
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
    showDots: boolean = true;
    dotColor: string = '#FFF';
    showCaptions: boolean = true;
    captionColor: string = '#FFF';
    captionBackground: string = 'rgba(0, 0, 0, .35)';
    lazyLoad: boolean = false;
    hideOnNoSlides: boolean = false;
    width: string = '100%';

    private _unsubscribeAll: Subject<any>;
    private currentUser: currentUser;

    constructor(
        private route: ActivatedRoute,
        private _httpClient: HttpClient,
        private _fuseConfigService: FuseConfigService,
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
        this.load_grid_data('data', {active: 1, user_id: 226}, ['id', 'city_id', 'metro_id', 'street_id', 'number', 'price', 'image'])
        this.load_grid_data('complex', {active: 1}, ['complex_id', 'image'])

    }
    
    load_grid_data(app_name, params: any, grid_item) {
        //console.log('load_grid_data');
        //console.log(params);
        const body = {action: 'model', anonymous: true, do: 'get_data', model_name: app_name, params: params, session_key: this.currentUser.session_key, grid_item: grid_item};
        //console.log(body);

        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, body)
            .subscribe((result: any) => {
                //console.log(result);
                this.init_data_slides(result.rows);
            });
    }
    
    init_data_slides ( rows ) {
        for (let key in rows) {
            let img_url = `${this.api_url}/img/data/`+rows[key]['image']['value'][0]['normal'];
            let slide_item = {url: img_url, caption: 'The first slide', href: 'https://www.sitebill.ru'};
            console.log(slide_item);
            this.imageUrls.push(slide_item);
        }        
    }
}
