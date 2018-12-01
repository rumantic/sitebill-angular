import { Injectable, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class FilterService {

    @Output() change: EventEmitter<any> = new EventEmitter();
    save(controls: any) {
        this.change.emit(controls);
    }
}
