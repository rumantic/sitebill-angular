import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseNavigation } from '@fuse/types';
import { FuseConfigService } from '@fuse/services/config.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseConfigService: FuseConfigService
    ) {
        //this._fuseNavigationService.removeNavigationItem('page');
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        //console.log('canActivate');
        
        if (localStorage.getItem('currentUser')) {
            //@todo: Нужно проверять текущую сессию на пригодность
            console.log('Activate result = ');
            let navigation_origin = this._fuseNavigationService.getNavigation('main');
            let navigtaion_clone = navigation_origin.slice(0);
            let storage = JSON.parse(localStorage.getItem('currentUser')) || []
            if (storage.admin_panel_login != 1) {
                console.log('access denied');
                this.disable_menu();
                this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                return false;
            }
            console.log(storage);

            //console.log('navigation');
            //console.log(navigtaion_clone);
            //console.log('permission');
            //console.log(storage['structure']);

            this.cleanUpNavigation(navigtaion_clone, storage['structure']);
            //console.log('complete cleanUp');

            // logged in so return true
            return true;
        } else {
            //Попробуем получить данные от cms sitebill для текущей сессии

        }
        this.disable_menu();
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }

    cleanUpNavigation(navigation: any[], permission) {
        //console.log(navigation.length);
        let remove_counter = 0;
        if (permission['group_name'] == 'admin') {
            return -1;
        }
        navigation.forEach((row, index) => {
            let need_remove = true;
            if (permission[row.id] != null) {
                if (permission[row.id].access != null) {
                    if (permission[row.id].access == 1) {
                        need_remove = false;
                        //console.log(row.id);
                        //console.log(row);
                        //console.log(permission);

                        //console.log('dont! remove ' + row.id);
                    }
                }
                //console.log(permission[row.id].access);
                //console.log(row.id);
            }
            if (need_remove && (row.id != 'access' && row.id != 'content' && row.id != 'dictionaries')) {
                //console.log('remove ' + row.id);
                ++remove_counter;
                //Этот механизм только удаляет записи. 
                //Если хотите чтобы в текущей сессии добавился пункт, после того как вы его в админке добавили тогда надо перегружать браузер
                this._fuseNavigationService.removeNavigationItem(row.id);
                //console.log('remove');
            } else {
                //this._fuseNavigationService.addNavigationItem(row.id);
            }
            if (row.children != null) {
                let children_clone = row.children.slice(0);
                let current_remove = this.cleanUpNavigation(children_clone, permission);
                if (current_remove == children_clone.length) {
                    this._fuseNavigationService.removeNavigationItem(row.id);
                }
            }
        });
        return remove_counter;

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

}