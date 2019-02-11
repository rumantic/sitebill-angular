import {Component, OnInit, isDevMode, Inject, Directive, ViewContainerRef} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {distinctUntilChanged, debounceTime, switchMap, tap, catchError} from 'rxjs/operators'
import {Subject, Observable, Subscription, of, concat} from 'rxjs';
import {FuseConfigService} from '@fuse/services/config.service';
import {coerceNumberProperty} from '@angular/cdk/coercion';
import {APP_CONFIG, AppConfig} from 'app/app.config.module';

import {takeUntil} from 'rxjs/operators';


import {currentUser} from 'app/_models/currentuser';
import {IImage} from 'ng-simple-slideshow';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Options, ChangeContext} from 'ng5-slider';
import {map, startWith} from 'rxjs/operators';

import {MatDialog, MatDialogConfig, MatDatepicker} from "@angular/material";
import {SelectDistrictDialogComponent} from "app/main/search-form/dialogs/select-district/select-district.component";
import {FilterService} from 'app/_services/filter.service';

import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {DOCUMENT} from '@angular/platform-browser';
import {DataService, Person} from './word.service';

import * as _moment from 'moment';
import {Moment} from 'moment';
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
    api_url: any;

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

    default_price_min = 5000000;

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

    options_price: Options = {
        floor: 5000000,
        ceil: 10000000
    };
    
    options_price_zero_10m: Options = {
        floor: 0,
        ceil: 10000000,
        step: 1000
    };
    

    options_floor: Options = {
        floor: 0,
        ceil: 25
    };
    options_floor_count: Options = {
        floor: 0,
        ceil: 30
    };
    
    options1: string[] = ['One', 'Two', 'Three'];

    //price_options: any[] = [{id: 0, value: 'Все'},{id: 1, value: 'до 1 500 000'}, 'до 2 000 000', 'до 3 000 000', 'до 5 000 000', 'diap'];
    price_options: any[] = [{id: 0, value: 'Все', actual: 0}, {id: 1, value: 'до 1 500 000', actual: 1500000}, {id: 2, value: 'до 2 000 000', actual: 2000000}, {id: 3, value: 'до 3 000 000', actual: 3000000}, {id: 4, value: 'до 5 000 000', actual: 5000000}, {id: 5, value: 'range'},];
    price_min: any;

    square_options: any[] = [{id: 1, value: 'range', actual: 1}];
    floor_options: any[] = [{id: 0, value: 'Все', actual: 0}, {id: 1, value: 'range', actual: 0}];
    floor_count_options: any[] = [{id: 0, value: 'Все', actual: 0}, {id: 1, value: 'range', actual: 0}];
    material_options: any[];
    topic_id_options: any[];
    district_id_options: any[];
    street_id_options: any[];
    complex_id_options: any[];
    dead_line_options: any[] = [{id: 0, value: 'Все', actual: 0}, {id: 1, value: 'range', actual: 0}];
    default_elements: string[] = ["room_count", "location", "price_selector", "square_selector", "floor_selector", "material_selector", "dead_line_selector", "second_realty", "no_commision"];
    active_elements: any[];
    min_dead_line: any;
    min_dead_line_date: any;
    max_dead_line_date: any;
    min_limit_dead_line: any;
    dead_line_open: boolean;

    square_min: number = 0;
    square_max: number = 300;

    floor_min: number = 0;
    floor_max: number = 25;
    
    floor_count_min: number = 0;
    floor_count_max: number = 30;

    floor_count_min_default: number = 0;
    floor_count_max_default: number = 30;
        

    filteredOptions: Observable<string[]>;
    myControl = new FormControl();

    words_options: any;

    //Для поиска по словам внутри объявлений
    people3$: Observable<Person[]>;
    people3Loading = false;
    people3input$ = new Subject<string>();
    selectedPersons: Person[] = <any>[{ name: 'Karyn Wright' }, { name: 'Other' }];


    constructor(
        private route: ActivatedRoute,
        private _httpClient: HttpClient,
        private _fuseConfigService: FuseConfigService,
        private dialog: MatDialog,
        private router: Router,
        @Inject(DOCUMENT) private document: any,
        @Inject(APP_CONFIG) private config: AppConfig,
        private filterService: FilterService,
        private _formBuilder: FormBuilder,
        private dataService: DataService
    ) {

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];
        if (isDevMode()) {
            this.api_url = this.config.apiEndpoint;
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
        this.loadPeople3();
        this.load_dictionary('topic_id');
        this.load_dictionary('walls');
        this.load_dictionary('district_id');
        this.load_dictionary('street_id');
        this.load_dictionary('complex_id');


        // Reactive Form
        this.form = this._formBuilder.group({
            location: [''],
            room_count: [''],
            price_selector: [],
            word: [],
            second_realty: [],
            no_commision: [],
            price_min: [this.default_price_min],
            price_max: ['10000000'],
            square_selector: [],
            srch_word: [],
            topic_id_selector: [],
            district_id_selector: [],
            street_id_selector: [],
            complex_id_selector: [],
            material_selector: [],
            floor_selector: [],
            floor_count_selector: [],
            dead_line_min: ['1'],
            dead_line_max: ['1'],
            not_first_floor: [false],
            not_last_floor: [false],
            dead_line_selector: []

        });
        this.init_input_parameters();


        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
        );
        this.filterService.change.subscribe(controls => {
            this.filterControls = controls;
            console.log(controls);
        });

        this.filterService.share.subscribe((datas) => {
            console.log(datas);
            this.filterSharedData = datas;
        });

    }

    init_input_parameters() {
        let app_root_element;
        let elements = [];
        if (this.document.getElementById('angular_search')) {
            app_root_element = this.document.getElementById('angular_search');
        } else if (this.document.getElementById('angular_search_ankonsul')) {
            app_root_element = this.document.getElementById('angular_search_ankonsul');
        } else if (this.document.getElementById('app_root')) {
            app_root_element = this.document.getElementById('app_root');
        }
        if (app_root_element.getAttribute('elements')) {
            elements = app_root_element.getAttribute('elements').split(',');
            this.default_elements = elements;
            if (!elements.find(x => x == 'no_commision')) {
                delete this.form.controls.no_commision;
            }
            if (!elements.find(x => x == 'second_realty')) {
                delete this.form.controls.second_realty;
            }
            if (!elements.find(x => x == 'dead_line_selector')) {
                delete this.form.controls.dead_line_selector;
            }
            if (!elements.find(x => x == 'material_selector')) {
                delete this.form.controls.material_selector;
            }
            if (!elements.find(x => x == 'floor_selector')) {
                delete this.form.controls.floor_selector;
            }
            if (!elements.find(x => x == 'square_selector')) {
                delete this.form.controls.square_selector;
            }
            if (!elements.find(x => x == 'price_selector')) {
                delete this.form.controls.price_selector;
            }
            if (!elements.find(x => x == 'location')) {
                delete this.form.controls.location;
            }
            if (!elements.find(x => x == 'room_count')) {
                delete this.form.controls.room_count;
            }

        }

        if (app_root_element.getAttribute('query_string')) {
            var query_string = app_root_element.getAttribute('query_string');
            var params = Object();
            params = this.parse_query_string(query_string);
            this.init_forms_from_params(params);
        }

    }
    
    public init_price_params (params: any) {
        if (params["price_min"] != null) {
            if ( params["price_min"] >= 5000000) {
                this.form.controls.price_selector.patchValue(5);
            }
            
            this.form.controls.price_min.patchValue(params["price_min"]);
            if (params["price"] != null) {
                this.form.controls.price_max.patchValue(params["price"]);
            }
        }

        if ( params["price"] >= 3000000 && params["price"] < 5000000) {
            this.form.controls.price_selector.patchValue(4);
        }
        
        if ( params["price"] >= 2000000 && params["price"] < 3000000) {
            this.form.controls.price_selector.patchValue(3);
        }
        
        if ( params["price"] >= 1500000 && params["price"] < 2000000) {
            this.form.controls.price_selector.patchValue(2);
        }
    }

    private init_forms_from_params(params: any) {
        this.init_price_params(params);

        if (params["srch_word"] != null) {
            this.form.controls.srch_word.patchValue(params["srch_word"]);
        }

        if (params["district_id[]"] != null) {
            this.form.controls.district_id_selector.patchValue(params["district_id[]"]);
        }
        if (params["topic_id[]"] != null) {
            this.form.controls.topic_id_selector.patchValue(params["topic_id[]"]);
        }

        if (params["room_count[]"] != null) {
            this.form.controls.room_count.patchValue(params["room_count[]"]);
        }

        if (params["square_min"] != null) {
            this.form.controls.square_selector.patchValue(1);
            this.square_min = params["square_min"];
        }
        if (params["square_max"] != null) {
            this.form.controls.square_selector.patchValue(1);
            this.square_max = params["square_max"];
        }

        if (params["floor_min"] != null) {
            this.form.controls.floor_selector.patchValue(1);
            this.floor_min = params["floor_min"];
        }
        if (params["floor_max"] != null) {
            this.form.controls.floor_selector.patchValue(1);
            this.floor_max = params["floor_max"];
        }
        
        if (params["floor_count_min"] != null) {
            this.form.controls.floor_count_selector.patchValue(1);
            this.floor_count_min = params["floor_count_min"];
        }
        if (params["floor_count_max"] != null) {
            this.form.controls.floor_count_selector.patchValue(1);
            this.floor_count_max = params["floor_count_max"];
        }
        

        if (params["not_first_floor"] != null) {
            this.form.controls.not_first_floor.patchValue(params["not_first_floor"]);
        }
        if (params["not_last_floor"] != null) {
            this.form.controls.not_last_floor.patchValue(params["not_last_floor"]);
        }

        if (params["walls[]"] != null) {
            this.form.controls.material_selector.patchValue(params["walls[]"]);
        }

        if (params["street_id[]"] != null) {
            this.form.controls.street_id_selector.patchValue(params["street_id[]"]);
        }
        if (params["complex_id[]"] != null) {
            this.form.controls.complex_id_selector.patchValue(params["complex_id[]"]);
        }
    }

    private parse_query_string(query_string: string) {
        var uri = decodeURI(query_string);
        var chunks = uri.split('&');
        var params = Object();

        for (var i = 0; i < chunks.length; i++) {
            var chunk = chunks[i].split('=');
            if (chunk[0].search("\\[\\]") !== -1) {
                if (typeof params[chunk[0]] === 'undefined') {
                    params[chunk[0]] = [chunk[1]];

                } else {
                    params[chunk[0]].push(chunk[1]);
                }


            } else {
                params[chunk[0]] = chunk[1];
            }
        }
        return params;
    }


    load_dictionary(columnName) {
        const request = {action: 'model', do: 'load_dictionary', columnName: columnName, anonymous: true, session_key: this.currentUser.session_key};

        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, request)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                if (result) {
                    if (columnName == 'district_id') {
                        this.district_id_options = result.data;
                    } else if (columnName == 'topic_id') {
                        this.topic_id_options = result.data;
                    } else if (columnName == 'street_id') {
                        this.street_id_options = result.data;
                    } else if (columnName == 'complex_id') {
                        this.complex_id_options = result.data;
                    } else if (columnName == 'walls') {
                        this.material_options = result.data;
                    }
                }
            });
    }


    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.options1.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    }

    private loadPeople3() {
        this.people3$ = concat(
            of([]), // default items
            this.people3input$.pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => this.people3Loading = true),
                switchMap(term => this.dataService.getPeople(term).pipe(
                    catchError(() => of([])), // empty list on error
                    tap(() => this.people3Loading = false)
                ))
            )
        );
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

    onPriceSliderChange(changeContext: ChangeContext): void {
        this.form.controls.price_selector.patchValue(5);

        this.form.controls.price_max.patchValue(changeContext.highValue);
        this.form.controls.price_min.patchValue(changeContext.value);
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
        query_parts = query_parts.concat(this.render_address_parts_separate());
        query_parts = query_parts.concat(this.render_price_parts());
        query_parts = query_parts.concat(this.render_square_parts());
        query_parts = query_parts.concat(this.render_floor_parts());
        query_parts = query_parts.concat(this.render_floor_count_parts());
        query_parts = query_parts.concat(this.render_room_count_parts());
        query_parts = query_parts.concat(this.render_checkbox_parts());
        query_parts = query_parts.concat(this.render_deadline_parts());
        query_parts = query_parts.concat(this.render_material_parts());
        query_parts = query_parts.concat(this.render_topic_id_parts());
        query_parts = query_parts.concat(this.render_srch_word_parts());

        //console.log(this.form.controls.material_selector.value);
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
    render_srch_word_parts() {
        let query_parts = [];
        try {
            if (this.form.controls.srch_word.value != null) {
                query_parts.push('srch_word=' + this.form.controls.srch_word.value);
            }
        } catch {

        }
        return query_parts;
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

    render_topic_id_parts() {
        let query_parts = [];
        try {
            for (let item of this.form.controls.topic_id_selector.value) {
                query_parts.push('topic_id[]=' + item);
            }
        } catch {

        }
        return query_parts;
    }


    render_floor_parts() {
        let query_parts = [];
        //console.log(this.form.controls.floor_selector.value);
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
    
    render_floor_count_parts() {
        let query_parts = [];
        //console.log(this.form.controls.floor_selector.value);
        try {
            if (this.form.controls.floor_count_selector.value == 1) {
                query_parts.push('floor_count_min=' + this.floor_count_min);
                query_parts.push('floor_count_max=' + this.floor_count_max);
            }
        } catch {

        }
        return query_parts;
    }
    

    render_deadline_parts() {
        let query_parts = [];
        try {
            if (this.form.controls.dead_line_selector.value == 1) {
                query_parts.push('min_dead_line=' + this.min_dead_line_date.value.format('Y-MM-DD'));
                query_parts.push('max_dead_line=' + this.max_dead_line_date.value.format('Y-MM-DD'));
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
        //console.log(this.form.controls.square_selector.value);
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

    render_address_parts_separate() {
        let query_parts = [];
        this.form.controls.location.patchValue('');
        try {
            if (this.form.controls.district_id_selector.value != null) {
                query_parts = query_parts.concat(this.render_address_query_part_separate('district_id', this.form.controls.district_id_selector.value));
            }
            if (this.form.controls.street_id_selector.value != null) {
                query_parts = query_parts.concat(this.render_address_query_part_separate('street_id', this.form.controls.street_id_selector.value));
            }
            if (this.form.controls.complex_id_selector.value != null) {
                query_parts = query_parts.concat(this.render_address_query_part_separate('complex_id', this.form.controls.complex_id_selector.value));
            }
        } catch {

        }
        return query_parts;
    }

    render_address_query_part_separate(key_name: string, controls_value: any) {
        try {
            let query_part = [];
            let find_value = this.form.controls.location.value;
            for (let item of controls_value) {
                query_part.push(key_name + '[]=' + item);
            }
            return query_part;
        } catch {
        }
    }


    render_address_query_part(key_name: string, controls_value: any) {
        try {
            let query_part = [];
            let find_value = this.form.controls.location.value;
            for (let item of controls_value) {
                query_part.push(key_name + '[]=' + item);
                find_value += ' ' + this.filterSharedData[key_name].find(x => x.id == item).value;
                this.form.controls.location.patchValue(find_value);
            }
            return query_part;
        } catch {
        }
    }

    render_material_parts() {
        let query_parts = [];
        try {
            for (let item of this.form.controls.material_selector.value) {
                query_parts.push('walls[]=' + item);
            }
        } catch {

        }
        return query_parts;
    }



    chosenYearHandler(normalizedYear: Moment, max: boolean) {
        let ctrlValue;
        this.form.controls.dead_line_selector.patchValue(1);
        if (max) {
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
        if (max) {
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

    open_dead_line() {
        this.dead_line_open = true;
        this.form.controls.dead_line_selector.patchValue(null);
    }
    change_dead_line() {
        this.dead_line_open = null;
    }
    apply_dead_line() {
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
