import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

import { fuseAnimations } from '@fuse/animations';


import {Observable, Subject} from 'rxjs';
import { ModelService } from 'app/_services/model.service';
import {FilterService} from "../../../_services/filter.service";
import {FormControl} from "@angular/forms";
import {SitebillEntity} from "../../../_models";


@Component({
    selector   : 'search-string-parser',
    templateUrl: './search-string-parser.component.html',
    styleUrls  : ['./search-string-parser.component.scss'],
    animations : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class SearchStringParserComponent implements OnInit, OnDestroy
{
    // Private
    private _unsubscribeAll: Subject<any>;

    @Input('search_string')
    search_string: string;

    @Input('entity')
    entity: SitebillEntity;


    parsed_string: string;
    public result_message: string;


    /**
     * Constructor
     *
     */
    constructor(
        public modelService: ModelService,
        public filterService: FilterService,
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.filterService.share.subscribe((entity: SitebillEntity) => {
            if (entity.get_app_name() == this.entity.get_app_name()) {
                this.parse();
            }
        });
    }

    getVariants()
    {
        let svariants = [
            {
                value: [],
                type: 'karea',
                pattern: /^(?:кух|кухн|кухня|кухни)\s*(\d{1,3})/,
                varname: 'kitchen',
                _match: '',
                _isMatchSuccess: function (match) {
                    var value = parseInt(match[1]);
                    return value >= 3 && value <= 100;
                },
                _setValue: function (match) {
                    var value = parseInt(match[1]);
                    if(value >= 3 && value <= 100){
                        this.value.push(value);
                    }
                },
                _getValue: function () {
                    return this.value;
                },
                _isMatch: function(search){
                    let k = new RegExp(this.pattern);
                    var match = k.exec(search);
                    //console.log(match);
                    if(match && this._isMatchSuccess(match)){
                        this._setValue(match);
                        this._match = match[0];
                        return true;
                    }
                    return false;
                }
            },
            {
                value: [],
                type: 'floor',
                pattern: /^(\d*)-(\d*)(\s?)этаж/,
                varname: 'floor',
                _match: '',
                _isMatchSuccess: function (match) {
                    return true;
                },
                _setValue: function (match) {
                    this.value.push(parseInt(match[1]));
                    this.value.push(parseInt(match[2]));
                },
                _getValue: function () {
                    return this.value;
                },
                _isMatch: function(search){
                    let k = new RegExp(this.pattern);
                    var match = k.exec(search);

                    if(match && this._isMatchSuccess(match)){
                        this._setValue(match);
                        this._match = match[0];
                        return true;
                    }
                    return false;
                }
            },
            {
                value: [],
                type: 'id',
                pattern: /^[№#](\d+)/,
                varname: 'id',
                _match: '',
                _isMatchSuccess: function (match) {
                    return true;
                },
                _setValue: function (match) {
                    this.value.push(parseInt(match[1]));
                },
                _getValue: function () {
                    return this.value;
                },
                _isMatch: function(search){
                    let k = new RegExp(this.pattern);
                    var match = k.exec(search);
                    if(match && this._isMatchSuccess(match)){
                        this._setValue(match);
                        this._match = match[0];
                        return true;
                    }
                    return false;
                }
            },
            {
                value: [],
                type: 'cheight',
                _match: '',
                pattern: /^(\-)?(\d+[.,]?\d*)(\-)?[мm](\-)?/,
                varname: 'cheight',
                _isMatchSuccess: function (match) {
                    console.log(match);

                    return true;
                },
                _setValue: function (match) {
                    if (match[1]) {
                        this.value.push(0);
                        this.value.push(match[2]);
                    } else if (match[3] || match[4]) {
                        this.value.push(match[2]);
                    } else {
                        this.value.push(match[2]);
                    }
                },
                _getValue: function () {
                    return this.value;
                },
                _isMatch: function(search){
                    let k = new RegExp(this.pattern);
                    var match = k.exec(search);
                    if(match && this._isMatchSuccess(match)){
                        this._setValue(match);
                        this._match = match[0];
                        return true;
                    }
                    return false;
                }
            },
            {
                value: [],
                type: 'area',
                _match: '',
                pattern: /^(\d{1,3})(?:\s|$)/,
                varname: 'area',
                _isMatchSuccess: function (match) {
                    var value = parseInt(match[1]);
                    return value >= 9 && value <= 199;
                },
                _setValue: function (match) {
                    this.value.push(match[1]);
                },
                _getValue: function () {
                    return this.value;
                },
                _isMatch: function(search){
                    let k = new RegExp(this.pattern);
                    var match = k.exec(search);
                    if(match && this._isMatchSuccess(match)){
                        this._setValue(match);
                        this._match = match[0];
                        return true;
                    }
                    return false;
                }
            },
            {
                value: [],
                type: 'rooms',
                _match: '',
                pattern: /^(\d{1}|ст(?=[^а-яА-ЯёЁa-zA-Z0-9])(?:\s|$))/,
                varname: 'rooms',
                _isMatchSuccess: function (match) {
                    console.log(match);
                    if (match[1].trim() == "ст") return true;
                    var value = parseInt(match[1]);
                    return value >= 1 && value <= 8;
                },
                _setValue: function (match) {
                    if (match[1].trim() == "ст") this.value.push(match[1]);
                    if(!isNaN(parseInt(match[1]))){
                        this.value.push(parseInt(match[1]));
                    }

                },
                _getValue: function () {
                    return this.value;
                },
                _isMatch: function(search){
                    let k = new RegExp(this.pattern);
                    var match = k.exec(search);
                    if(match && this._isMatchSuccess(match)){
                        this._setValue(match);
                        this._match = match[0];
                        return true;
                    }
                    return false;
                }
            }
        ];

        return svariants;
    }

    parse(testString = null) {

        let search = this.search_string;
        if (testString !== null) {
            search = testString;
        }


        let svariants = this.getVariants();

        let found = {};

        let anymatch = false;

        while(search.length > 0){

            //console.log('строка: '+search);
            var match = null;
            //anymatch = false;
            for(var i in svariants){
                if(svariants[i]._isMatch(search)){
                    found[svariants[i].varname] = svariants[i]._getValue();
                    match = svariants[i]._match;
                    break;
                }
            }

            if(match){
                let matchlength = match.length;
                search = search.substring(matchlength).trim();
            }else{
                let stp = search.split(' ');
                delete stp[0];
                search = stp.join(' ').trim();
            }
        }

        //console.log(found);

        let s = [];
        for(var srtype in found){
            if(srtype == 'area'){
                if(found[srtype].length == 1){
                    s.push('Площадь, м: от ' + found[srtype][0]);
                }else if(found[srtype].length > 1){
                    let ar = found[srtype].sort();
                    s.push('Площадь, м: от ' + ar[0] + ' до ' + ar[ar.length - 1]);
                }
            }
            if(srtype == 'kitchen'){
                if(found[srtype].length == 1){
                    s.push('Кухня, м: от ' + found[srtype][0]);
                }else if(found[srtype].length > 1){
                    let ar = found[srtype].sort();
                    s.push('Кухня, м: от ' + ar[0] + ' до ' + ar[ar.length - 1]);
                }
            }
            if(srtype == 'floor'){
                if(found[srtype].length == 1){
                    s.push('Этаж: от ' + found[srtype][0]);
                }else if(found[srtype].length > 1){
                    let ar = found[srtype].sort();
                    s.push('Этаж: от ' + ar[0] + ' до ' + ar[ar.length - 1]);
                }
            }
            if(srtype == 'rooms'){
                s.push('Комнат: ' + found[srtype].join(', '));
            }
            if(srtype == 'id'){
                s.push('ID: ' + found[srtype].join(', '));
            }
        }


        //let parse_array = this.search_string.split(' ');
        //this.result_message = '1 комн, 50 м';
        this.result_message = s.join(' ');
        return this.result_message;
        //console.log(parse_array);
    }



    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}
