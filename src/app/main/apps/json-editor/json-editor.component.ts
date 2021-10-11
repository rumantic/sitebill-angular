import { Component } from '@angular/core';

import { ModelService } from 'app/_services/model.service';
import {Subject} from "rxjs";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {JsonParams} from "../../../_models";

@Component({
    selector   : 'json-editor',
    templateUrl: './json-editor.component.html',
    styleUrls  : ['./json-editor.component.scss']
})
export class JsonEditorComponent
{
    protected _unsubscribeAll: Subject<any>;
    form: FormGroup;
    json: JsonParams;

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
        for (const [key_obj, value_obj] of Object.entries(this.json)) {
            let form_control_item = new FormControl(key_obj);
            this.form.addControl(this.getKeyName(i), form_control_item);

            form_control_item = new FormControl(value_obj);
            this.form.addControl(this.getValueName(i), form_control_item);
            i++;
        }
    }

    getKeyName( index: number ) {
        return 'key-' + index.toString();
    }
    getValueName( index: number ) {
        return 'value-' + index.toString();
    }

}
