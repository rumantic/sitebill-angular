import {Component, isDevMode, ElementRef, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FuseConfigService} from '@fuse/services/config.service';
import {currentUser} from 'app/_models/currentuser';
import {DOCUMENT} from '@angular/common';
import {APP_CONFIG, AppConfig} from 'app/app.config.module';

import {FuseTranslationLoaderService} from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import {locale as english} from './i18n/en';
import {locale as russian} from './i18n/ru';

import {AuthService} from 'angularx-social-login';
import {SocialUser} from 'angularx-social-login';
import {FacebookLoginProvider} from 'angularx-social-login';
import { ModelService } from 'app/_services/model.service';


@Component({
    selector: 'facebook',
    templateUrl: './facebook.component.html',
    styleUrls: ['./facebook.component.scss']
})
export class FacebookComponent {
    user: SocialUser;

    private currentUser: currentUser;
    private api_url: string;
    private cms_config: any;

    /**
     * Constructor
     *
     */
    constructor(
        private _httpClient: HttpClient,
        private elRef: ElementRef,
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        @Inject(APP_CONFIG) private config: AppConfig,
        private authService: AuthService,
        private modelSerivce: ModelService,
        private translate: TranslateService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(russian, english);
        this.translate.use('ru');

        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];
        this.api_url = this.modelSerivce.get_api_url();

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
    ngOnInit() {
        this.authService.authState.subscribe((user) => {
            this.user = user;
            this.load_config();
        });
    }

    load_config () {
        const body = {action: 'config', anonymous: false, do: 'get', session_key: this.currentUser.session_key};
        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, body)
            .subscribe((result: any) => {
                if ( result.state == 'success' ) {
                    this.cms_config = result.data;
                    this.refreash_access_token();
                } else {
                    console.log(result.message);
                }
            });
    }

    refreash_access_token () {
        //console.log('refreash');
        //Получаем текущий access_token из базы
        const body = {action: 'config', anonymous: false, do: 'getHiddenConfigValue', key: 'apps.facebook.access_token', session_key: this.currentUser.session_key};
        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, body)
            .subscribe((result: any) => {
                console.log(result);
                this.test_token(result.data);
            });

        //Выполняем тестовый запросы с этим токеном
        //Если все ок, тогда ничего не делаем
        //Если нет, то предлагаем авторизоваться заново
    }

    test_token ( access_token ) {
        //let access_token = 'EAAGZBmgctvgUBAIoxx1IsrZAZAb6uaZBfcdi0gb5RFrqriWKEowxZAHgSwXDFBrNuNipInn727UULeIZCVtkjtxhZA4bw1Qx08n78w5AUBWlZC8INV94Y2Xi19ET8PhiDUpC6KU5B6St5wHtImiV2agpMDZB1vFQxKM3Xt2W5ZAxGuR5eKZBXYEF9kTQKyaTjN54CfJ25IorhYHKQZDZD';

        const body = {access_token: access_token};
        this._httpClient.post(`https://graph.facebook.com/me`, body)
            .subscribe((result: any) => {
                if (result.id != '' ) {
                    console.log('good me status: '+ result.id);
                    return true;
                } else {
                    this.exchange_token(this.user.authToken);
                }
            }, error => {
                console.log('error on me status');
                this.exchange_token(this.user.authToken);
            }
            );

    }

    exchange_token (authToken) {
        //long live https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=ID&client_secret=SEC&fb_exchange_token=TOKEN
        let client_id = this.cms_config['apps.facebook.app_id'];
        let client_secret = this.cms_config['apps.facebook.app_secret'];

        //const body = {grant_type: 'fb_exchange', client_id: client_id, client_secret: client_secret, fb_exchange_token: authToken};
        let url = `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=`+client_id+`&client_secret=`+ client_secret +`&fb_exchange_token=${authToken}`;
        this._httpClient.get(url)
            .subscribe((result: any) => {
                if (result.access_token != '' ) {
                    this.update_access_token(result.access_token);
                } else {
                    console.log(result);
                }
            });
    }

    update_access_token (access_token) {
        const body = {action: 'config', anonymous: false, do: 'updateHiddenConfigValue', key: 'apps.facebook.access_token', value: access_token, session_key: this.currentUser.session_key};
        this._httpClient.post(`${this.api_url}/apps/api/rest.php`, body)
            .subscribe((result: any) => {
                console.log(result);
            });
    }

    signInWithFB(): void {
        this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }
    signOut(): void {
        this.authService.signOut();
        this.update_access_token ('false');
    }
    debug () {
	console.log(this.user);
    }


    init_input_parameters() {
        let app_root_element;
        if (this.document.getElementById('calculator_mini_root')) {
            app_root_element = this.document.getElementById('calculator_mini_root');
        } else if (this.document.getElementById('app_root').getAttribute('realty_price') > 0) {
            app_root_element = this.document.getElementById('app_root');
        }
    }


}
