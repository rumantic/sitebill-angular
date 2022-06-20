import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {FormConstructorComponent} from './form-constructor.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { ModelService } from 'app/_services/model.service';
import {FormBuilder} from '@angular/forms';
import { SnackService } from 'app/_services/snack.service';
import { FilterService } from 'app/_services/filter.service';
import { Bitrix24Service } from 'app/integrations/bitrix24/bitrix24.service';
import {MatDialog} from '@angular/material/dialog';
import { StorageService } from 'app/_services/storage.service';
import {SitebillEntity} from '../../../_models';

describe('FormConstructorComponent', () => {

    let component: FormConstructorComponent;
    let fixture: ComponentFixture<FormConstructorComponent>;

    // const fakeMatDialogRef = jasmine.createSpyObj('fakeMatDialogRef', ['close']);
    const fakeModelService = {...jasmine.createSpyObj('fakeModelService', ['get_access', 'get_user_id', 'get_api_url', 'get_app_name']), entity: new SitebillEntity()};
    const fakeFormBuilder = jasmine.createSpyObj('fakeFormBuilder', ['group']);
    const fakeSnackService = jasmine.createSpyObj('fakeSnackService', ['message']);
    const fakeMatDialog = jasmine.createSpyObj('fakeMatDialog', ['open']);
    const fakeFilterService = {};
    const fakeBitrix24Service = {};
    // const fakeAppConfig = {};
    // const fakeMatDialogData = jasmine.createSpyObj('fakeMatDialogData', ['set_readonly', 'is_delete_disabled', 'get_key_value', 'get_table_name']);
    const fakeStorageService = jasmine.createSpyObj('fakeStorageService', ['getItem']);

    beforeEach(async () => { //
        TestBed.overrideComponent(FormConstructorComponent, {set: {providers: []}});
        await TestBed.configureTestingModule({
            declarations: [ FormConstructorComponent ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                // { provide: MatDialogRef, useValue: fakeMatDialogRef },
                { provide: ModelService, useValue: fakeModelService },
                { provide: FormBuilder, useValue: fakeFormBuilder },
                { provide: SnackService, useValue: fakeSnackService },
                { provide: MatDialog, useValue: fakeMatDialog },
                { provide: FilterService, useValue: fakeFilterService },
                { provide: Bitrix24Service, useValue: fakeBitrix24Service },
                // { provide: APP_CONFIG, useValue: fakeAppConfig },
                // { provide: MAT_DIALOG_DATA, useValue: fakeMatDialogData },
                { provide: StorageService, useValue: fakeStorageService },
             ]
        })
            .compileComponents();
    });
    beforeEach(() => {
        fixture = TestBed.createComponent(FormConstructorComponent);
        component = fixture.componentInstance;
        console.log(component);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

});