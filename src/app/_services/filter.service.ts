import { Injectable, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { SitebillEntity } from 'app/_models';

@Injectable()
export class FilterService {
    share_array = [];
    params_count = [];

    @Output() change: EventEmitter<any> = new EventEmitter();
    @Output() share: EventEmitter<any> = new EventEmitter();
    
    save(controls: any) {
        this.change.emit(controls);
    }
    share_data(entity: SitebillEntity, key: string, datas: any) {
        if (this.params_count[entity.app_name] == null) {
            this.params_count[entity.app_name] = 0;
        }
        this.params_count[entity.app_name]++;
        if (this.share_array[entity.app_name] == null) {
            this.share_array[entity.app_name] = [];
        }
        this.share_array[entity.app_name][key] = datas;
        this.share.emit(entity);
        //console.log(this.share_array);
    }
    unshare_data(entity: SitebillEntity, key: string) {
        if (this.share_array[entity.app_name] != null ) {
            delete (this.share_array[entity.app_name][key]);
            this.share.emit(entity);
        }
    }
    empty_share(entity: SitebillEntity) {
        this.share.emit(entity);
    }
}
