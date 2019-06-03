import { AuthGuard } from ".";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { FuseNavigationService } from "@fuse/components/navigation/navigation.service";
import { FuseConfigService } from "@fuse/services/config.service";
import { ModelService } from "app/_services/model.service";
import { SnackService } from "app/_services/snack.service";

@Injectable()
export class PublicGuard extends AuthGuard {
    constructor(
        router: Router,
        protected modelService: ModelService,
        _fuseNavigationService: FuseNavigationService,
        _fuseConfigService: FuseConfigService,
        protected _snackService: SnackService,
    ) {
        super(
            router,
            modelService,
            _fuseNavigationService,
            _fuseConfigService,
            _snackService
        );
        //this._fuseNavigationService.removeNavigationItem('page');
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        //console.log('public canActivate');
        return this.check_session(route, state, '/public/lead/');
    }
    check_permissions(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        //@todo: Нужно проверять текущую сессию на пригодность
        //console.log('Activate result = ');
        //console.log('check permission public');
        this.set_public_menu();

        let navigation_origin = this._fuseNavigationService.getNavigation('main');
        let navigtaion_clone = navigation_origin.slice(0);
        let storage = JSON.parse(localStorage.getItem('currentUser')) || [];
        this.cleanUpNavigation(navigtaion_clone, storage['structure']);

        if (storage['structure'] == null) {
            this.modelService.logout();
            return false;
        }

        if (storage['structure']['group_name'] == null) {
            this.modelService.logout();
            return false;
        }

        //console.log('complete cleanUp');

        // logged in so return true
        return true;
    }
}
