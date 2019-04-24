import { FuseNavigation } from '@fuse/types';

export const public_navigation: FuseNavigation[] = [
    {
        id: 'client',
        title: 'Заявки',
        type: 'item',
        icon: 'favorite',
        url: 'public/client',
    },

    {
        id: 'login',
        title: 'Выход',
        type: 'item',
        icon: 'exit_to_app',
        url: '/logout/'
    },
];
