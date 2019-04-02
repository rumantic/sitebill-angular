import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'CRM',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id: 'data_grid',
                title: 'Объекты',
                type: 'item',
                icon: 'home',
                url: 'grid/data',
                /*
                badge    : {
                    title    : '25',
                    translate: 'NAV.SAMPLE.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }
                */
            },
            {
                id       : 'client_grid',
                title    : 'Заявки',
                type     : 'item',
                icon: 'face',
                url      : 'grid/client',
                /*
                badge    : {
                    title    : '25',
                    translate: 'NAV.SAMPLE.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }
                */
            },
            {
                id: 'user_grid',
                title: 'Пользователи',
                type: 'item',
                icon: 'supervisor_account',
                url: 'grid/user',
                /*
                badge    : {
                    title    : '25',
                    translate: 'NAV.SAMPLE.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }
                */
            },

            {
                id: 'news_grid',
                title: 'Новости',
                type: 'item',
                icon: 'email',
                url: 'grid/news',
                /*
                badge    : {
                    title    : '25',
                    translate: 'NAV.SAMPLE.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }
                */
            },

            /*
            {
                id       : 'sample',
                title    : 'Sample',
                type     : 'item',
                icon     : 'logout',
                url      : 'sample'
            },
            */
            
            /*
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
            */
            {
                id       : 'login',
                title    : 'Выход',
                type     : 'item',
                icon: 'exit_to_app',
                url      : '/login'
            }
        ]
    }
];
