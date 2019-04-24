import { AuthGuard } from ".";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { FuseNavigationService } from "@fuse/components/navigation/navigation.service";
import { FuseConfigService } from "@fuse/services/config.service";
import { public_navigation } from 'app/navigation/public.navigation';

@Injectable()
export class PublicGuard extends AuthGuard {
    constructor(
        router: Router,
        _fuseNavigationService: FuseNavigationService,
        _fuseConfigService: FuseConfigService
    ) {
        super(
            router,
            _fuseNavigationService,
            _fuseConfigService
        );
        //this._fuseNavigationService.removeNavigationItem('page');
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        //console.log('canActivate');

        if (localStorage.getItem('currentUser')) {
            //@todo: Нужно проверять текущую сессию на пригодность
            //console.log('Activate result = ');
            this._fuseNavigationService.unregister('main');
            this._fuseNavigationService.register('main', public_navigation);
            this._fuseNavigationService.setCurrentNavigation('main');

            let navigation_origin = this._fuseNavigationService.getNavigation('main');
            let navigtaion_clone = navigation_origin.slice(0);
            let storage = JSON.parse(localStorage.getItem('currentUser')) || []
            /*
            if (storage.admin_panel_login != 1) {
                console.log('access denied');
                this.disable_menu();
                this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                return false;
            }
            */
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
        } else {
            //Попробуем получить данные от cms sitebill для текущей сессии

        }
        this.disable_menu();
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
