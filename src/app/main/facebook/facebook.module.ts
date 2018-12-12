import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

import {FuseSharedModule} from '@fuse/shared.module';

import {FacebookComponent} from './facebook.component';
import {SocialLoginModule} from 'angularx-social-login';
import {AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider, LoginOpt} from 'angularx-social-login';
const fbLoginOptions: LoginOpt = {
    scope: 'pages_messaging,pages_messaging_subscriptions,email,pages_show_list,manage_pages,publish_to_groups',
    return_scopes: true,
    enable_profile_selector: true
}; // https://developers.facebook.com/docs/reference/javascript/FB.login/v2.11

const config = new AuthServiceConfig([
    {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider('491043731389957', fbLoginOptions)
    },
]);

export function provideConfig() {
    return config;
}

const routes = [
    {
        path: '**',
        component: FacebookComponent
    }
];

@NgModule({
    declarations: [
        FacebookComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        TranslateModule,
        SocialLoginModule,
        FuseSharedModule
    ],
    providers: [
        {
            provide: AuthServiceConfig,
            useFactory: provideConfig
        }
    ]
})

export class FacebookModule {
}
