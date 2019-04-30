import { AuthGuard } from ".";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { FuseNavigationService } from "@fuse/components/navigation/navigation.service";
import { FuseConfigService } from "@fuse/services/config.service";
import { public_navigation } from 'app/navigation/public.navigation';
import { ModelService } from "app/_services/model.service";
import { takeUntil } from "rxjs/operators";

@Injectable()
export class PublicGuard extends AuthGuard {
    constructor(
        router: Router,
        protected modelSerivce: ModelService,
        _fuseNavigationService: FuseNavigationService,
        _fuseConfigService: FuseConfigService
    ) {
        super(
            router,
            modelSerivce,
            _fuseNavigationService,
            _fuseConfigService
        );
        //this._fuseNavigationService.removeNavigationItem('page');
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        //console.log('canActivate');

        if (localStorage.getItem('currentUser')) {
            return this.check_permission(route, state);
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
                            this.router.navigate(['/public/lead/']);
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
    check_permission(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        //@todo: Нужно проверять текущую сессию на пригодность
        //console.log('Activate result = ');
        this._fuseNavigationService.unregister('main');
        this._fuseNavigationService.register('main', public_navigation);
        this._fuseNavigationService.setCurrentNavigation('main');

        let navigation_origin = this._fuseNavigationService.getNavigation('main');
        let navigtaion_clone = navigation_origin.slice(0);
        let storage = JSON.parse(localStorage.getItem('currentUser')) || []
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
}
