import { Injectable, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class FilterService {
    share_array = [];

    @Output() change: EventEmitter<any> = new EventEmitter();
    @Output() share: EventEmitter<any> = new EventEmitter();
    
    save(controls: any) {
        this.change.emit(controls);
    }
    share_data(key: string, datas: any) {
        this.share_array[key] = datas;
        this.share.emit(this.share_array);
    }
    empty_share() {
        this.share.emit(this.share_array);
    }
}
