import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ModelService} from './model.service';

@Injectable()
export class SitebillAuthService {
    @Output() complete_emitter: EventEmitter<any> = new EventEmitter();
    private state: string = 'zero';

    /**
     * Constructor
     */
    constructor(
        private http: HttpClient,
        private modelService: ModelService,
    )
    {

    }

    init () {
        console.log('SitebillAuthService.init');
        this.modelService.init_config_standalone();
        this.modelService.config_loaded_emitter.subscribe(
            (result: any) => {
                if ( result ) {
                    console.log('this.modelService.config_loaded_emitter.subscribe result = true');
                    this.init_user();
                }
            },
            error => {
                console.log('error this.modelService.config_loaded_emitter.subscribe');
                console.log(error);
            },
            complete => {
                console.log('this.modelService.config_loaded_emitter.subscribe complete')
            }
        );
    }

    init_user () {
        this.check_session_key_safe();
        this.modelService.valid_user_emitter.subscribe(
            (result: any) => {
                if ( result ) {
                    console.log('sitebillAuthServices.init_user result = true');
                    console.log(this.modelService.get_session_key());
                    this.init_permissions();
                }
            },
            error => {
                console.log('error sitebillAuthServices.init_user');
                console.log(error);
            },
            complete => {
                console.log('sitebillAuthServices.init_user complete')
            }
        );
    }

    init_permissions () {
        this.modelService.init_permissions();
        this.modelService.init_permissions_complete_emitter.subscribe(
            (result: any) => {
                if ( result ) {
                    console.log('sitebillAuthServices.init_permissions result = true');
                    this.init_complete();
                }
            },
            error => {
                console.log('error sitebillAuthServices.init_permissions');
                console.log(error);
            },
            complete => {
                console.log('sitebillAuthServices.init_permissions complete')
            }
        );

    }

    check_session_key_safe() {
        const session_key = this.modelService.get_session_key();
        if (!this.modelService.is_validated_session_key()) {
            this.modelService.validateKey(session_key).subscribe((result: any) => {
                if (result.error === 'check_session_key_failed') {
                    console.log('check_session_key_failed need reload');
                } else {
                    this.modelService.session_key_validate();
                }
            });
        }
    }


    init_complete () {
        this.complete_emitter.emit(true);
        this.state = 'ready';
    }

    complete () {
        return this.complete_emitter;
    }

    get_state () {
        return this.state;
    }



    get_products() {
        const request = { action: 'cart', do: 'get_products', anonymous: true, session_key: this.modelService.get_session_key_safe() };
        return this.http.post(`${this.modelService.get_api_url()}/apps/api/rest.php`, request);
    }
}
