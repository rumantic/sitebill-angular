import {Component, Input} from '@angular/core';

import { ModelService } from 'app/_services/model.service';
import {Subject} from "rxjs";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {JsonParams} from "../../../_models";
import {takeUntil} from "rxjs/operators";

@Component({
    selector   : 'json-editor',
    templateUrl: './json-editor.component.html',
    styleUrls  : ['./json-editor.component.scss']
})
export class JsonEditorComponent
{
    protected _unsubscribeAll: Subject<any>;
    form: FormGroup;

    @Input()
    json: JsonParams;

    form_length: number = 0;

    constructor(
        protected modelService: ModelService,
        protected _formBuilder: FormBuilder,
    ) {
        this._unsubscribeAll = new Subject();
        this.form = this._formBuilder.group({});
        this.json = {
            allow_htmltags: "a",
            depended: "d",
            linked: "l",
            map_height: "300",
            map_width: "350",
            sdfsdfsdf: "s",
        }
    }

    ngOnInit(): void {
        let i = 0;
        if ( this.json ) {
            for (const [key_obj, value_obj] of Object.entries(this.json)) {
                let form_control_item = new FormControl(key_obj);
                this.form.addControl(this.getKeyName(i), form_control_item);

                form_control_item = new FormControl(value_obj);
                this.form.addControl(this.getValueName(i), form_control_item);
                i++;
            }
        }
        this.form_length = i;
        console.log(this.form_length);

        this.form.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((status) => {
                let test =  this.recreateJson(status);
                console.log(test);
            });
    }

    recreateJson ( newKeyValue: {} ):JsonParams {
        let new_json:JsonParams = {};
        for ( let i = 0; i < this.form_length; i++ ) {
            new_json[newKeyValue[this.getKeyName(i)]] = newKeyValue[this.getValueName(i)];
        }
        return new_json;
    }

    getKeyName( index: number ) {
        return 'key-' + index.toString();
    }
    getValueName( index: number ) {
        return 'value-' + index.toString();
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
