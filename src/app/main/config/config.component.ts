import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Subject} from "rxjs";
import {debounceTime, distinctUntilChanged, takeUntil} from "rxjs/operators";
import {ModelService} from "../../_services/model.service";
import {SitebillResponse} from "../../_models/sitebill-response";
import {MediaMatcher} from "@angular/cdk/layout";
import {SitebillEntity} from "../../_models";
import {ConfigFormComponent} from "./config-form/config-form.component";
import {SnackService} from "../../_services/snack.service";
import {FormControl} from "@angular/forms";
import * as _ from "lodash";

@Component({
    selector: 'app-config',
    templateUrl: './config.component.html',
    styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
    protected _unsubscribeAll: Subject<any>;
    public sitebillResponse:SitebillResponse;
    public itemsList:any;
    public menuItems:any;
    entity: SitebillEntity;
    public searchControl: FormControl;
    private debounce: number = 400;


    mobileQuery: MediaQueryList;

    private _mobileQueryListener: () => void;
    public saveButton: boolean = false;

    @ViewChild(ConfigFormComponent) config_form_child: ConfigFormComponent;


    constructor(
        protected modelService: ModelService,
        protected _snackService: SnackService,
        changeDetectorRef: ChangeDetectorRef, media: MediaMatcher
    ) {
        this._unsubscribeAll = new Subject();
        this.sitebillResponse = new SitebillResponse();
        this.searchControl = new FormControl('');


        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);

        this.entity = new SitebillEntity();
        this.entity.set_app_name('config');
        this.entity.set_table_name('fake_config');
        this.entity.primary_key = 'id';
        this.entity.set_key_value(0);

    }

    ngOnInit(): void {
        this.modelService.system_config()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                Object.assign(this.sitebillResponse, result);
                if ( this.sitebillResponse.success() ) {

                    this.showAppsConfig(0);
                } else {
                    this._snackService.error(this.sitebillResponse.message);
                }
            });

        this.searchControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(this.debounce),
                distinctUntilChanged(),
            )
            .subscribe((result: string) => {
                this.showAppsConfig(0, this.filterBy(this.sitebillResponse.data, result));
            });

    }

    filterBy(array, value = null){
        if (!value || value === '') {
            return array;
        }
        let filtered = [];
        let tmp_array = _.cloneDeep(array);



        for(let i = 0; i < tmp_array.length; i++){

            let obj = Object.assign({}, tmp_array[i].data);
            let f1 = Object.keys(obj)
                .filter( key =>
                    key.indexOf(value) >= 0
                    || obj[key].title.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) >= 0
                    || obj[key].hint.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) >= 0
                    || (obj[key].value && obj[key].value.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) >= 0)
                )
                .reduce( (res, key) => (res[key] = obj[key], res), {} );
            if ( Object.keys(f1).length !== 0 ) {
                //console.log(f1);
                tmp_array[i].data = f1;
                filtered.push(tmp_array[i]);
            }

        }

        return filtered;

    }

    save(event) {
        let ql_items = this.config_form_child.get_changed_items();
        this.modelService.update_system_config(ql_items)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: SitebillResponse) => {
                if ( result.state === 'success' ) {
                    this._snackService.message('Конфигурация обновлена успешно!');
                } else {
                    this._snackService.error('Ошибка при обновлении конфигурации: ' + result.message);
                }
            });

        this.saveButton = false;
    }


    OnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    showAppsConfig(index: number, filtered_array = null) {
        if ( !filtered_array ) {
            filtered_array = this.filterBy(this.sitebillResponse.data, this.searchControl.value);
        }

        this.itemsList = filtered_array[index];
        this.menuItems = filtered_array;
    }

    showSaveButton() {
        this.saveButton = true;
    }

    clear_search_text() {
        this.searchControl.patchValue('');
    }
}
