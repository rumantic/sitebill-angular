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

import {MatDialog, MatDialogConfig} from "@angular/material";
import {SelectDistrictDialogComponent} from "app/main/search-form/dialogs/select-district/select-district.component";
import {FilterService} from 'app/main/documentation/components-third-party/datatable/filter.service';



@Component({
    selector: 'search',
    templateUrl: './search-form.component.html',
    styleUrls: ['./search-form.component.css'],
    providers: [FilterService],
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

    value1: number = 4;
    highValue: number = 100;
    options: Options = {
        floor: 0,
        ceil: 100
    };
    options1: string[] = ['One', 'Two', 'Three'];
    filteredOptions: Observable<string[]>;
    myControl = new FormControl();
    mission = '<no mission announced parent>';
    subscription: Subscription;



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

        this.subscription = filterService.missionAnnounced$.subscribe(
            mission => console.log('event subsciption'));


        this.controlPressed = false;
        this.controlProcessing = true;
    }


    ngOnInit() {
        // Reactive Form
        this.form = this._formBuilder.group({
            company: [
                {
                    value: 'Google',
                    disabled: true
                }, Validators.required
            ],
            firstName: [''],
            lastName: [''],
            option1: [''],
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
        const link = "['http://genplan1/?district_id=1']";
        const url = '/test';
        window.location.href = '/test';
        //this.router.navigate(['/externalRedirect', { externalUrl: url }], {    });        
        //this.router.navigate(['/test']);
        
    }
    
    refreash () {
        
        console.log('refreash');
        console.log(this.mission);
        console.log(this.subscription);
        /*
        this.filterService.missionAnnounced$.subscribe(
            mission => {
                this.mission = mission;
                //this.announced = true;
                //this.confirmed = false;
            });
            */
    }

    select_district () {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.width = '600px';
        dialogConfig.height = '400px';
        dialogConfig.autoFocus = true;
        dialogConfig.data = {app_name: 'test'};

        let dialogRef =this.dialog.open(SelectDistrictDialogComponent, dialogConfig);
        dialogRef.afterClosed()
            .subscribe(() => {
                this.refreash();
            })
        return;
    }
}
