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
                url      : '/documentation/components-third-party/datatables/ngx-datatable',
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
            }
        ]
    },
    {
        id      : 'pages',
        title   : 'Pages',
        type    : 'group',
        icon    : 'pages',
        children: [
            {
                id      : 'authentication',
                title   : 'Авторизация',
                type    : 'collapsable',
                icon    : 'lock',
                badge   : {
                    title: '10',
                    bg   : '#525e8a',
                    fg   : '#FFFFFF'
                },
                children: [
                    {
                        id   : 'login',
                        title: 'Вход',
                        type : 'item',
                        url  : '/pages/auth/login'
                    }
                ]
            }
        ]
    }
];
