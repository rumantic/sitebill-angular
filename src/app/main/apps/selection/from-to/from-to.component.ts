import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-from-to',
  templateUrl: './from-to.component.html',
  styleUrls: ['./from-to.component.scss']
})
export class FromToComponent implements OnInit {

    @Input() parentForm!: FormGroup;
    @Input() defValue;
    readonly formGroup = new FormGroup({
        minValue: new FormControl(),
        maxValue: new FormControl(this.defValue)
    });

    ngOnInit(): void {
        console.log(this.defValue);
        this.parentForm.addControl('fromTo', this.formGroup);
    }
}
