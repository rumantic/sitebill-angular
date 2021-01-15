import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { ModelService } from 'app/_services/model.service';
import {SearchStringParserComponent} from "../search-string-parser.component";
import {FilterService} from "../../../../_services/filter.service";


@Component({
    selector   : 'search-string-parser-test',
    templateUrl: './search-string-parser-test.component.html',
    styleUrls  : ['./search-string-parser-test.component.scss'],
    animations : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class SearchStringParserTestComponent extends SearchStringParserComponent
{
    test_complete = false;
    private test_result_hash: any[];
    /**
     * Constructor
     *
     */
    constructor(
        public modelService: ModelService,
        public filterService: FilterService,
    )
    {
        super(
            modelService,
            filterService
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        const test_input = [
            {input: '1 1', expected: 'Комнат: 1, 1'},
            {input: '1 1 1', expected: 'Комнат: 1, 1, 1'},
            {input: '1 1 50', expected: 'Комнат: 1, 1 Площадь, м: от 501'},
        ];
        let test_result;
        this.test_result_hash = [];
        test_input.forEach(
            (element) => {
                test_result = this.parse(element.input);
                this.test_result_hash.push({input:element.input, output: test_result, expected: element.expected, status: (element.expected === test_result ? true:false)});
                console.log('Input = ' + element + ', Output = ' + test_result)
            }
        );
        this.test_complete = true;
        console.log(this.test_result_hash);
        //this.parse('1 1');
    }

    get_test_class(status: boolean) {
        return (status?'green-800-fg':'red-800-fg');
    }

    get_status_message(status: boolean) {
        return (status?'OK':'Error');
    }
}
