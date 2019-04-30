import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseNavigation } from '@fuse/types';
import { FuseConfigService } from '@fuse/services/config.service';
import { ModelService } from 'app/_services/model.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
    protected _unsubscribeAll: Subject<any>;

    constructor(
        protected router: Router,
        protected modelSerivce: ModelService,
        protected _fuseNavigationService: FuseNavigationService,
        protected _fuseConfigService: FuseConfigService
    ) {
        this._unsubscribeAll = new Subject();

        //this._fuseNavigationService.removeNavigationItem('page');
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log(localStorage.getItem('currentUser'));
        
        if (localStorage.getItem('currentUser')) {
            return this.check_permissions(route, state);
        } else {
            //Попробуем получить данные от cms sitebill для текущей сессии
            console.log('try get cms session');
            this.modelSerivce.get_cms_session()
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    console.log(result);
                    let storage = JSON.parse(result) || [];
                    console.log(storage);

                    if (storage.user_id > 0) {
                        localStorage.setItem('currentUser', JSON.stringify(storage));
                        if (this.check_permissions(route, state)) {
                            this.router.navigate(['/grid/data/']);
                            return true;
                        } else {
                            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                            return false;
                        }
                    } else {
                        this.disable_menu();
                        // not logged in so redirect to login page with the return url
                        //this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
                        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                        return false;
                    }
                });
        }
    }

    check_permissions(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        //@todo: Нужно проверять текущую сессию на пригодность
        //console.log('Activate result = ');
        let navigation_origin = this._fuseNavigationService.getNavigation('main');
        let navigtaion_clone = navigation_origin.slice(0);
        let storage = JSON.parse(localStorage.getItem('currentUser')) || [];
        console.log('check_permissions');
        console.log(storage);
        if (storage.admin_panel_login == 0) {
            this.router.navigate(['/public/lead/']);
            return true;
        } else if (storage.admin_panel_login != 1) {
            console.log('access denied');
            this.disable_menu();
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }
        //console.log(storage);

        //console.log('navigation');
        //console.log(navigtaion_clone);
        //console.log('permission');
        //console.log(storage['structure']);
        if (storage['structure'] == null) {
            this.disable_menu();
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }

        if (storage['structure']['group_name'] == null) {
            this.disable_menu();
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }

        this.cleanUpNavigation(navigtaion_clone, storage['structure']);

        //console.log('complete cleanUp');

        // logged in so return true
        return true;
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