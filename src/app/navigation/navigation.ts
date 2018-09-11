import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Объекты',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id       : 'myobjects',
                title    : 'Мои объекты',
                type     : 'item',
                icon     : 'email',
                url      : '/data/my',
                badge    : {
                    title    : '25',
                    translate: 'NAV.SAMPLE.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }
            },
            {
                id       : 'allobjects',
                title    : 'Все объекты',
                type     : 'item',
                icon     : 'email',
                url      : '/documentation/components-third-party/datatables/ngx-datatable/all',
                badge    : {
                    title    : '250',
                    translate: 'NAV.SAMPLE.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }
            },
            {
                id       : 'clientobjects',
                title    : 'Подборки клиента',
                type     : 'item',
                icon     : 'email',
                url      : '/apps/mail-ngrx/inbox/',
                badge    : {
                    title    : '250',
                    translate: 'NAV.SAMPLE.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }
            },
            {
                id       : 'login',
                title    : 'Вход',
                type     : 'item',
                icon     : 'email',
                url      : '/login'
            }
        ]
    }
];
