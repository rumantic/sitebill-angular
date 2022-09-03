import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-from-to',
  templateUrl: './from-to.component.html',
  styleUrls: ['./from-to.component.scss']
})
export class FromToComponent implements OnInit {

    @Input() parentForm!: FormGroup;
    @Input() filterName;
    formName: string;
    currentYear = (new Date()).getFullYear();
    formGroup: FormGroup ;
    fromToControls;

    @Input() currency = '$';

    constructor() {
    }


    ngOnInit(): void {
        this.formGroup = new FormGroup({
            minValue: new FormControl('', Validators.pattern('[0-9]*')),
            maxValue: new FormControl(this.getInputValue(), Validators.pattern('[0-9]*'))
        });
        this.formName = `${this.filterName}FromTo`;
        this.parentForm.addControl(`${this.formName}`, this.formGroup);
        this.fromToControls = this.parentForm.controls[this.formName]['controls'];
    }

    getInputValue(): number {
        if (this.filterName === 'year') {
            return this.currentYear;
        }
    }

    show() {
        // console.log(this);
    }
}
