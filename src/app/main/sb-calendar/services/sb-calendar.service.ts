import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class SbCalendarService {
    updateEvents$ = new EventEmitter();
}