import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  options: FormGroup;
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];

  constructor(fb: FormBuilder) {
      this.options = fb.group({
          bottom: 0,
          fixed: false,
          top: 0
      });
  }

  ngOnInit(): void {
  }

}
