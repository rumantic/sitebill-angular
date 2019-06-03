import { Injectable, Inject, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';
import { currentUser } from 'app/_models/currentuser';
import { SitebillEntity } from 'app/_models';
import {Router} from '@angular/router';
import {FuseConfigService} from '../../@fuse/services/config.service';


@Injectable()
export class ModelService {
    private api_url: string = '';
    protected currentUser: currentUser;
    public entity: SitebillEntity;


    constructor(
        private http: HttpClient,
        private router: Router,
        protected _fuseConfigService: FuseConfigService,
        @Inject(APP_CONFIG) private config: AppConfig,
    ) {
        this.entity = new SitebillEntity;
        this.entity.set_app_name(null);
        this.entity.set_table_name(null);
        this.entity.primary_key = null;
        this.entity.key_value = null;

        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];
        this.set_api_url(localStorage.getItem('api_url'));
    }

    set_api_url(api_url: string) {
        this.api_url = api_url;
    }

    get_api_url() {
        if (isDevMode() && this.api_url == '') {
            //console.log('dev url');
            return this.config.apiEndpoint;
        } else if (this.api_url == null) {
            return '';
        } else {
            //console.log('prod url');
            return this.api_url;
        }
    }

    get_session_key() {
        if ( this.currentUser == null ) {
            return null;
        }
        return this.currentUser.session_key;
    }

    get_session_key_safe () {
        let session_key = this.get_session_key();
        if ( session_key == null ) {
            this.logout();
        }
        return session_key;
    }

    get_user_id() {
        if ( this.currentUser == null ) {
            return null;
        }
        return this.currentUser.user_id;
    }

    reset_local_user_storage () {
        localStorage.removeItem('currentUser');
        if ( this.currentUser != null ) {
            this.currentUser.session_key = null;
            this.currentUser = null;
        }
    }

    logout () {
        this.disable_menu();
        this.reset_local_user_storage();
        this.router.navigate(['/logout']);
    }

    disable_menu() {
        //console.log('disable menu');
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                }
            }
        };
    }

    reinit_currentUser() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];
    }

    load(model_name, grid_item, filter_params_json, owner, page, per_page) {
        const body = { action: 'model', do: 'get_data', model_name: model_name, owner: owner, page: page, per_page: per_page, params: filter_params_json, session_key: this.get_session_key_safe(), grid_item: grid_item };
        //console.log(body);
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    //Возвращаем только записи, которые используются в связанной таблице
    load_dictionary(columnName) {
        const request = { action: 'model', do: 'load_dictionary', columnName: columnName, anonymous: true, session_key: this.get_session_key_safe() };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, request);
    }

    //Возвращаем только записи, которые используются в связанной таблице
    load_dictionary_model(model_name, columnName) {
        const request = { action: 'model', do: 'load_dictionary', columnName: columnName, model_name: model_name, anonymous: true, session_key: this.get_session_key_safe() };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, request);
    }

    //Возвращает все записи
    load_dictionary_model_all(model_name, columnName) {
        const request = { action: 'model', do: 'load_dictionary', columnName: columnName, model_name: model_name, switch_off_ai_mode: true, anonymous: true, session_key: this.get_session_key_safe() };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, request);
    }

    get_max(model_name, columnName) {
        const request = { action: 'model', do: 'get_max', model_name: model_name, columnName: columnName, anonymous: true, session_key: this.get_session_key_safe() };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, request);
    }

    loadById(model_name, primary_key, key_value) {
        const load_data_request = { action: 'model', do: 'load_data', model_name: model_name, primary_key: primary_key, key_value: key_value, session_key: this.get_session_key_safe() };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, load_data_request);
    }

    native_insert(model_name, ql_items) {
        const body = { action: 'model', do: 'native_insert', model_name: model_name, ql_items: ql_items, session_key: this.get_session_key_safe() };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    native_update(model_name, key_value, ql_items) {
        const body = { action: 'model', do: 'native_update', model_name: model_name, key_value: key_value, ql_items: ql_items, session_key: this.get_session_key_safe() };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    update(model_name, key_value, ql_items) {
        const body = { action: 'model', do: 'graphql_update', model_name: model_name, key_value: key_value, ql_items: ql_items, session_key: this.get_session_key_safe() };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    update_only_ql(model_name, key_value, ql_items) {
        const body = { action: 'model', do: 'graphql_update', model_name: model_name, only_ql: true, key_value: key_value, ql_items: ql_items, session_key: this.get_session_key_safe() };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    update_column_meta(model_name, column_name, key, params) {
        const body = { action: 'model', do: 'update_column_meta', model_name: model_name, column_name: column_name, key: key, params: params, session_key: this.get_session_key_safe() };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    delete(model_name, primary_key, key_value) {
        const body = { action: 'model', do: 'delete', model_name: model_name, key_value: key_value, primary_key: primary_key, session_key: this.get_session_key_safe() };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    new_empty_record(model_name) {
        const body = { action: 'model', do: 'new_empty_record', model_name: model_name, session_key: this.get_session_key_safe() };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    deleteImage(model_name, key_name, key_value, image_id, field_name) {
        const body = { layer: 'native_ajax', action: 'dz_imagework', what: 'delete', model_name: model_name, key: key_name, key_value: key_value, current_position: image_id, field_name: field_name, session_key: this.get_session_key_safe() };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    deleteAllImages(model_name, key_name, key_value, field_name) {
        const body = { layer: 'native_ajax', action: 'dz_imagework', what: 'delete_all', model_name: model_name, key: key_name, key_value: key_value, field_name: field_name, session_key: this.get_session_key_safe() };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    reorderImage(model_name, key_name, key_value, image_id, direction, field_name) {
        let body = {};
        if (direction == 'make_main') {
            body = { layer: 'native_ajax', action: 'dz_imagework', what: 'make_main', model_name: model_name, key: key_name, key_value: key_value, current_position: image_id, field_name: field_name, session_key: this.get_session_key_safe() };
        } else {
            body = { layer: 'native_ajax', action: 'dz_imagework', what: 'reorder', reorder: direction, model_name: model_name, key: key_name, key_value: key_value, current_position: image_id, field_name: field_name, session_key: this.get_session_key_safe() };
        }
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    rotateImage(model_name, key_name, key_value, image_id, rot_dir, field_name) {
        let body = {};
        body = { layer: 'native_ajax', action: 'dz_imagework', what: 'rotate', rot_dir: rot_dir, model_name: model_name, key: key_name, key_value: key_value, current_position: image_id, field_name: field_name, session_key: this.get_session_key_safe() };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    load_grid_columns(entity: SitebillEntity) {
        let body = {};
        body = { action: 'model', do: 'load_grid_columns', model_name: entity.get_table_name(), session_key: this.get_session_key_safe() };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    format_grid(entity: SitebillEntity, grid_items: string[], per_page) {
        let body = {};
        body = { action: 'model', do: 'format_grid', model_name: entity.get_table_name(), grid_items: grid_items, per_page: per_page, session_key: this.get_session_key_safe() };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    uppend_uploads(model_name, key_name, key_value, field_name) {
        let body = {};
        body = { action: 'model', do: 'uppend_uploads', model_name: model_name, primary_key: key_name, key_value: key_value, image_field: field_name, session_key: this.get_session_key_safe() };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    toggle_collections(domain, deal_id, title, data_id) {
        let body = {};
        body = { action: 'memorylist', do: 'toggle', domain: domain, deal_id: deal_id, title: title, data_id: data_id, session_key: this.get_session_key_safe() };
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

    get_cms_session() {
        let body = {};
        body = { layer: 'native_ajax', get_cms_session: '1'};
        return this.http.post(`${this.get_api_url()}/apps/api/rest.php`, body);
    }

}