import { AuthGuard } from ".";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { FuseNavigationService } from "@fuse/components/navigation/navigation.service";
import { FuseConfigService } from "@fuse/services/config.service";
import { public_navigation } from 'app/navigation/public.navigation';
import { ModelService } from "app/_services/model.service";
import { takeUntil } from "rxjs/operators";
import { SnackService } from "app/_services/snack.service";

@Injectable()
export class PublicGuard extends AuthGuard {
    constructor(
        router: Router,
        protected modelSerivce: ModelService,
        _fuseNavigationService: FuseNavigationService,
        _fuseConfigService: FuseConfigService,
        protected _snackService: SnackService,
    ) {
        super(
            router,
            modelSerivce,
            _fuseNavigationService,
            _fuseConfigService,
            _snackService
        );
        //this._fuseNavigationService.removeNavigationItem('page');
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.check_session(route, state, '/public/lead/');
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
