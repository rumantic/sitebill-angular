import {Component, Inject, OnInit, isDevMode} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Subject, Observable, Subscription} from 'rxjs';
import {FuseConfigService} from '@fuse/services/config.service';
import {coerceNumberProperty} from '@angular/cdk/coercion';

import {currentUser} from 'app/_models/currentuser';
import {IImage} from 'ng-simple-slideshow';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Options} from 'ng5-slider';
import {map, startWith} from 'rxjs/operators';

import {MatDialog, MatDialogConfig, MatDatepicker} from "@angular/material";
import {SelectDistrictDialogComponent} from "app/main/search-form/dialogs/select-district/select-district.component";
import {FilterService} from 'app/main/documentation/components-third-party/datatable/filter.service';

import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
import { Moment } from 'moment';
const moment = _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
    selector: 'search',
    templateUrl: './search-form.component.html',
    styleUrls: ['./search-form.component.css'],
    providers: [
        {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ],
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
    private filterControls: any;
    private filterSharedData: any;

    value1: number = 4;
    highValue: number = 100;
    options: Options = {
        floor: 0,
        ceil: 300
    };
    options_floor: Options = {
        floor: 0,
        ceil: 25
    };
    options1: string[] = ['One', 'Two', 'Three'];

    //price_options: any[] = [{id: 0, value: 'Все'},{id: 1, value: 'до 1 500 000'}, 'до 2 000 000', 'до 3 000 000', 'до 5 000 000', 'diap'];
    price_options: any[] = [{id: 0, value: 'Все', actual: 0}, {id: 1, value: 'до 1 500 000', actual: 1500000}, {id: 2, value: 'до 2 000 000', actual: 2000000}, {id: 3, value: 'до 3 000 000', actual: 3000000}, {id: 4, value: 'до 5 000 000', actual: 5000000}, {id: 5, value: 'range'},];
    price_min: any;

    square_options: any[] = [{id: 1, value: 'range', actual: 1}];
    floor_options: any[] = [{id: 0, value: 'Все', actual: 0}, {id: 1, value: 'range', actual: 0}];
    dead_line_options: any[] = [{id: 0, value: 'Все', actual: 0}, {id: 1, value: 'range', actual: 0}];
    min_dead_line: any;
    min_dead_line_date: any;
    max_dead_line_date: any;
    min_limit_dead_line: any;
    dead_line_open: boolean;

    square_min: number = 0;
    square_max: number = 300;

    floor_min: number = 0;
    floor_max: number = 25;

    filteredOptions: Observable<string[]>;
    myControl = new FormControl();



    constructor(
        private route: ActivatedRoute,
        private _httpClient: HttpClient,
        private _fuseConfigService: FuseConfigService,
        private dialog: MatDialog,
        private router: Router,
        private filterService: FilterService,
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
        this.min_limit_dead_line = new Date();
        this.min_dead_line_date = new FormControl(moment());
        this.max_dead_line_date = new FormControl(moment());
        this.dead_line_open = null;



        this.controlPressed = false;
        this.controlProcessing = true;
    }


    ngOnInit() {
        console.log(this.price_options);
        // Reactive Form
        this.form = this._formBuilder.group({
            company: [
                {
                    value: 'Google',
                    disabled: true
                }, Validators.required
            ],
            location: [''],
            lastName: [''],
            option1: [''],
            room_count: [''],
            price_selector: [],
            second_realty: [],
            no_commision: [],
            price_min: ['5000000'],
            price_max: ['10000000'],
            square_selector: [],
            floor_selector: [],
            dead_line_min: ['1'],
            dead_line_max: ['1'],
            not_first_floor: [false],
            not_last_floor: [false],
            dead_line_selector: [],


            address: ['', Validators.required],
            address2: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            postalCode: ['', [Validators.required, Validators.maxLength(5)]],
            country: ['', Validators.required],
            realty_price: ['', Validators.required],
        });

        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
        );
        this.filterService.change.subscribe(controls => {
            this.filterControls = controls;
            console.log(controls);
        });
        
        this.filterService.share.subscribe( (datas) => {
            console.log(datas);
            this.filterSharedData = datas;
            //console.log(key);
            //console.log(datas);
        });
        
        //this.load_grid_data('data', {active: 1, user_id: 226}, ['id', 'city_id', 'country_id', 'street_id', 'number', 'price', 'currency_id', 'image'])
        //this.load_grid_data('complex', {active: 1}, ['complex_id', 'name', 'url', 'image'])

    }
    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.options1.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
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

    search() {
        console.log('search');
        let query_parts = [];
        let url = '';

        query_parts = query_parts.concat(this.render_address_parts());
        query_parts = query_parts.concat(this.render_price_parts());
        query_parts = query_parts.concat(this.render_square_parts());
        query_parts = query_parts.concat(this.render_floor_parts());
        query_parts = query_parts.concat(this.render_room_count_parts());
        query_parts = query_parts.concat(this.render_checkbox_parts());
        query_parts = query_parts.concat(this.render_deadline_parts());

        console.log(this.form.controls.room_count.value);

        console.log('query_part');
        console.log(query_parts);

        url = query_parts.join("&");
        console.log(url);
        if (!isDevMode()) {
            window.location.href = '/?' + url;
        }

        //this.router.navigate(['/externalRedirect', { externalUrl: url }], {    });
        //this.router.navigate(['/test']);
    }


    render_room_count_parts() {
        let query_parts = [];
        try {
            for (let item of this.form.controls.room_count.value) {
                query_parts.push('room_count[]=' + item);
            }
        } catch {

        }
        return query_parts;
    }

    render_floor_parts() {
        let query_parts = [];
        try {
            if (this.form.controls.floor_selector.value == 1) {
                query_parts.push('floor_min=' + this.floor_min);
                query_parts.push('floor_max=' + this.floor_max);
            }
            if (this.form.controls.not_first_floor.value) {
                query_parts.push('not_first_floor=' + 1);
            }
            if (this.form.controls.not_last_floor.value) {
                query_parts.push('not_last_floor=' + 1);
            }

        } catch {

        }
        return query_parts;
    }
    
    render_deadline_parts() {
        let query_parts = [];
        try {
            console.log(this.form.controls.dead_line_selector.value);
            if (this.form.controls.dead_line_selector.value == 1) {
                query_parts.push('min_dead_line=' + this.min_dead_line_date.value.format('Y-M-D'));
                query_parts.push('max_dead_line=' + this.max_dead_line_date.value.format('Y-M-D'));
            }
        } catch {

        }
        return query_parts;
    }
    
    
    render_checkbox_parts() {
        let query_parts = [];
        try {
            if (this.form.controls.second_realty.value) {
                query_parts.push('second_realty=' + 1);
            }
            if (this.form.controls.no_commision.value) {
                query_parts.push('no_commision=' + 1);
            }

        } catch {

        }
        return query_parts;
    }
    

    render_square_parts() {
        let query_parts = [];
        try {
            if (this.form.controls.square_selector.value == 1) {
                query_parts.push('square_min=' + this.square_min);
                query_parts.push('square_max=' + this.square_max);
            }
        } catch {

        }
        return query_parts;
    }

    render_price_parts() {
        let query_parts = [];
        try {
            if (this.price_options[this.form.controls.price_selector.value].value == 'range') {
                query_parts.push('price_min=' + this.form.controls.price_min.value);
                query_parts.push('price=' + this.form.controls.price_max.value);
            } else {
                query_parts.push('price=' + this.price_options[this.form.controls.price_selector.value].actual);
            }
        } catch {

        }
        return query_parts;
    }

    render_address_parts() {
        let query_parts = [];
        this.form.controls.location.patchValue('');
        try {
            query_parts = query_parts.concat(this.render_address_query_part('district_id', this.filterControls.district_id.value));
            query_parts = query_parts.concat(this.render_address_query_part('street_id', this.filterControls.street_id.value));
            query_parts = query_parts.concat(this.render_address_query_part('complex_id', this.filterControls.complex_id.value));
        } catch {

        }
        return query_parts;
    }

    render_address_query_part(key_name: string, controls_value: any) {
        try {
            let query_part = [];
            let find_value = this.form.controls.location.value;
            for (let item of controls_value) {
                query_part.push(key_name + '[]=' + item);
                find_value += ' ' + this.filterSharedData[key_name].find(x=>x.id == item).value; 
                this.form.controls.location.patchValue(find_value);
            }
            return query_part;
        } catch {
        }
    }
    

    chosenYearHandler(normalizedYear: Moment, max: boolean) {
        let ctrlValue;
        if ( max ) {
            ctrlValue = this.max_dead_line_date.value;
            ctrlValue.year(normalizedYear.year());
            this.max_dead_line_date.setValue(ctrlValue);
        } else {
            ctrlValue = this.min_dead_line_date.value;
            ctrlValue.year(normalizedYear.year());
            this.min_dead_line_date.setValue(ctrlValue);
        }
    }

    chosenMonthHandler(normlizedMonth: Moment, datepicker: MatDatepicker<Moment>, max: boolean) {
        let ctrlValue;
        if ( max ) {
            ctrlValue = this.max_dead_line_date.value;
            ctrlValue.month(normlizedMonth.month());
            this.max_dead_line_date.setValue(ctrlValue);
        } else {
            ctrlValue = this.min_dead_line_date.value;
            ctrlValue.month(normlizedMonth.month());
            this.min_dead_line_date.setValue(ctrlValue);
        }
        datepicker.close();
        
    }
    
    open_dead_line () {
        this.dead_line_open = true;
        this.form.controls.dead_line_selector.patchValue(null);
    }
    change_dead_line () {
        this.dead_line_open = null;
        this.form.controls.dead_line_selector.patchValue(1);
    }
    
    select_district() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.width = '600px';
        dialogConfig.height = '600px';
        dialogConfig.autoFocus = true;
        dialogConfig.data = {app_name: 'test'};

        let dialogRef = this.dialog.open(SelectDistrictDialogComponent, dialogConfig);
        dialogRef.afterClosed()
            .subscribe(() => {
                this.render_address_parts();
            })
        return;
    }
}
