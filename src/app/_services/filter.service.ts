import { Injectable, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { SitebillEntity } from 'app/_models';

@Injectable()
export class FilterService {
    share_array = [];
    params_count = [];
    private share_counter_array = [];

    @Output() change: EventEmitter<any> = new EventEmitter();
    @Output() share: EventEmitter<any> = new EventEmitter();


    constructor() {
        this.share_array = [];
    }

    onInnerChange(value) {
        this.share.emit(value);
    }
    
    save(controls: any) {
        this.change.emit(controls);
    }
    share_data(entity: SitebillEntity, key: string, datas: any) {
        if (this.params_count[entity.get_app_name()] == null) {
            this.params_count[entity.get_app_name()] = 0;
        }
        this.params_count[entity.get_app_name()]++;
        if (this.share_array[entity.get_app_name()] == null) {
            this.share_array[entity.get_app_name()] = [];
        }
        this.share_array[entity.get_app_name()][key] = datas;
        //console.log(this.share_array);
        this.onInnerChange(entity);
    }
    unshare_data(entity: SitebillEntity, key: string) {
        if (this.share_array[entity.get_app_name()] != null ) {
            delete (this.share_array[entity.get_app_name()][key]);
            this.onInnerChange(entity);
        }
    }
    empty_share(entity: SitebillEntity) {
        this.onInnerChange(entity);
    }

    share_counter(entity: SitebillEntity, key: string, datas: any) {
        if (this.share_counter_array[entity.get_app_name()] == null) {
            this.share_counter_array[entity.get_app_name()] = [];
        }
        this.share_counter_array[entity.get_app_name()][key] = datas;
    }

    get_counter_value(app_name:string, key: string) {
        if (this.share_counter_array[app_name] != null) {
            return this.share_counter_array[app_name][key];
        }
        return null;
    }

    broadcast_refresh () {
        //console.log('broadcast_refresh');
        //console.log(this.share_array);
    }
}
