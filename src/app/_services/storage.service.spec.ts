import {TestBed} from '@angular/core/testing';
import {StorageService} from './storage.service';
import {Bitrix24Service} from '../integrations/bitrix24/bitrix24.service';


describe('StorageService', () => {

    const fakeBitrix24Service = jasmine.createSpyObj('fakeBitrix24Service',
        ['init_input_parameters', 'is_bitrix24_inited']);
    let storageService: any = '';
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                StorageService,
                {provide: Bitrix24Service, useValue: fakeBitrix24Service},
            ],
        });
        storageService = TestBed.inject(StorageService);
        console.log(storageService);
    });

    it('should create', () => {
        expect(storageService).toBeDefined();
    });

    it('getItem() should have been called', () => {
        const spy = spyOn(storageService, 'getItem').and.callThrough();
        storageService.getItem('testItem');
        expect(spy).toHaveBeenCalled();
    });

    it('setItem() should have been called', () => {
        const spy = spyOn(storageService, 'setItem').and.callThrough();
        storageService.setItem('testItem', 'testValue');
        expect(spy).toHaveBeenCalled();
    });
});
