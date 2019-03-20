import { Injectable, Inject, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';
import { currentUser } from 'app/_models/currentuser';
import { SitebillEntity } from 'app/_models';


@Injectable()
export class ModelService {
    api_url: string;
    protected currentUser: currentUser;
    public entity: SitebillEntity;


    constructor(
        private http: HttpClient,
        @Inject(APP_CONFIG) private config: AppConfig,
    ) {
        if (isDevMode()) {
            this.api_url = this.config.apiEndpoint;
        } else {
            this.api_url = '';
        }
        this.entity = new SitebillEntity;
        this.entity.app_name = null;
        this.entity.primary_key = null;
        this.entity.key_value = null;

        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];
    }

    load(model_name, grid_item, filter_params_json, owner) {
        const body = { action: 'model', do: 'get_data', model_name: model_name, owner: owner, params: filter_params_json, session_key: this.currentUser.session_key, grid_item: grid_item };
        return this.http.post(`${this.api_url}/apps/api/rest.php`, body);
    }

    load_dictionary(columnName) {
        const request = { action: 'model', do: 'load_dictionary', columnName: columnName, anonymous: true, session_key: this.currentUser.session_key };
        return this.http.post(`${this.api_url}/apps/api/rest.php`, request);
    }


    loadById(model_name, primary_key, key_value) {
        const load_data_request = { action: 'model', do: 'load_data', model_name: model_name, primary_key: primary_key, key_value: key_value, session_key: this.currentUser.session_key };
        return this.http.post(`${this.api_url}/apps/api/rest.php`, load_data_request);
    }

    update(model_name, key_value, ql_items) {
        const body = { action: 'model', do: 'graphql_update', model_name: model_name, key_value: key_value, ql_items: ql_items, session_key: this.currentUser.session_key };
        return this.http.post(`${this.api_url}/apps/api/rest.php`, body);
    }

    delete(model_name, primary_key, key_value) {
        const body = { action: 'model', do: 'delete', model_name: model_name, key_value: key_value, primary_key: primary_key, session_key: this.currentUser.session_key };
        return this.http.post(`${this.api_url}/apps/api/rest.php`, body);
    }

    new_empty_record(model_name) {
        const body = { action: 'model', do: 'new_empty_record', model_name: model_name, session_key: this.currentUser.session_key };
        return this.http.post(`${this.api_url}/apps/api/rest.php`, body);
    }

    deleteImage(model_name, key_name, key_value, image_id, field_name) {
        const body = { layer: 'native_ajax', action: 'dz_imagework', what: 'delete', model_name: model_name, key: key_name, key_value: key_value, current_position: image_id, field_name: field_name, session_key: this.currentUser.session_key };
        return this.http.post(`${this.api_url}/apps/api/rest.php`, body);
    }

    deleteAllImages(model_name, key_name, key_value, field_name) {
        const body = { layer: 'native_ajax', action: 'dz_imagework', what: 'delete_all', model_name: model_name, key: key_name, key_value: key_value, field_name: field_name, session_key: this.currentUser.session_key };
        return this.http.post(`${this.api_url}/apps/api/rest.php`, body);
    }

    reorderImage(model_name, key_name, key_value, image_id, direction, field_name) {
        let body = {};
        if (direction == 'make_main') {
            body = { layer: 'native_ajax', action: 'dz_imagework', what: 'make_main', model_name: model_name, key: key_name, key_value: key_value, current_position: image_id, field_name: field_name, session_key: this.currentUser.session_key };
        } else {
            body = { layer: 'native_ajax', action: 'dz_imagework', what: 'reorder', reorder: direction, model_name: model_name, key: key_name, key_value: key_value, current_position: image_id, field_name: field_name, session_key: this.currentUser.session_key };
        }
        return this.http.post(`${this.api_url}/apps/api/rest.php`, body);
    }

    rotateImage(model_name, key_name, key_value, image_id, rot_dir, field_name) {
        let body = {};
        body = { layer: 'native_ajax', action: 'dz_imagework', what: 'rotate', rot_dir: rot_dir, model_name: model_name, key: key_name, key_value: key_value, current_position: image_id, field_name: field_name, session_key: this.currentUser.session_key };
        return this.http.post(`${this.api_url}/apps/api/rest.php`, body);
    }

    uppend_uploads(model_name, key_name, key_value, field_name) {
        let body = {};
        body = { action: 'model', do: 'uppend_uploads', model_name: model_name, primary_key: key_name, key_value: key_value, image_field: field_name, session_key: this.currentUser.session_key };
        return this.http.post(`${this.api_url}/apps/api/rest.php`, body);
    }

    /*
    getById(id: number) {
        return this.http.get('/api/users/' + id);
    }

    create(user: User) {
        return this.http.post('/api/users', user);
    }

    update(user: User) {
        return this.http.put('/api/users/' + user.id, user);
    }

    delete(id: number) {
        return this.http.delete('/api/users/' + id);
    }
    */
}