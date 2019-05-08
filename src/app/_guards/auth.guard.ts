import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { ModelService } from 'app/_services/model.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SnackService } from 'app/_services/snack.service';
import { navigation } from 'app/navigation/navigation';
import { public_navigation } from 'app/navigation/public.navigation';


@Injectable()
export class AuthGuard implements CanActivate {
    protected _unsubscribeAll: Subject<any>;

    constructor(
        protected router: Router,
        protected modelSerivce: ModelService,
        protected _fuseNavigationService: FuseNavigationService,
        protected _fuseConfigService: FuseConfigService,
        protected _snackService: SnackService,
    ) {
        this._unsubscribeAll = new Subject();

        //this._fuseNavigationService.removeNavigationItem('page');
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.check_session(route, state,'/grid/data/');
    }

    check_session(route: ActivatedRouteSnapshot, state: RouterStateSnapshot, success_redirect: string) {
        //console.log(localStorage.getItem('currentUser'));

        if (localStorage.getItem('currentUser')) {
            return this.check_permissions(route, state);
        } else {
            //Попробуем получить данные от cms sitebill для текущей сессии
            console.log('try get cms session');
            this.modelSerivce.get_cms_session()
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    console.log(result);
                    if (result.state == 'error') {
                        this.disable_menu();
                        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                        return false;
                    }
                    try {
                        let storage = JSON.parse(result) || [];
                        console.log(storage);

                        if (storage.user_id > 0) {
                            localStorage.setItem('currentUser', JSON.stringify(storage));
                            if (this.check_permissions(route, state)) {
                                this.router.navigate([success_redirect]);
                                return true;
                            } else {
                                this.set_public_menu();
                                this.router.navigate(['/public/'], { queryParams: { returnUrl: state.url } });
                                return true;
                            }
                        } else {
                            this.disable_menu();
                            // not logged in so redirect to login page with the return url
                            //this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
                            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                            return false;
                        }
                    } catch (e) {
                        console.log(e);
                        this.disable_menu();
                        this._snackService.message('Ошибка подключения к API');
                        return false;
                    }
                }, error => {
                    console.log(error);
                    this.disable_menu();
                    this._snackService.message('Невозможно подключиться к серверу');
                    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                    return false;
                });
        }
    }

    set_public_menu() {
        //console.log('set public menu');
        this._fuseNavigationService.unregister('main');
        this._fuseNavigationService.register('main', public_navigation.slice(0));
        this._fuseNavigationService.setCurrentNavigation('main');
    }

    check_permissions(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        //@todo: Нужно проверять текущую сессию на пригодность
        //console.log('Activate result = ');
        //console.log('check_permissions');
        //console.log(navigation);

        this._fuseNavigationService.unregister('main');
        this._fuseNavigationService.register('main', navigation.slice(0));
        this._fuseNavigationService.setCurrentNavigation('main');

        let navigation_origin = this._fuseNavigationService.getNavigation('main');
        let navigtaion_clone = navigation_origin.slice(0);
        let storage = JSON.parse(localStorage.getItem('currentUser')) || [];
        this.cleanUpNavigation(navigtaion_clone, storage['structure']);

        //console.log(storage);
        if (storage.admin_panel_login == 0) {
            //console.log('got to /public/lead/');
            this.set_public_menu();
            this.router.navigate(['/public/lead/']);
            return false;
        } else if (storage.admin_panel_login != 1) {
            console.log('access denied');
            this.disable_menu();
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }
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

        return true;
    }

    cleanUpNavigation(navigation: any[], permission) {
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
                    }
                }
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