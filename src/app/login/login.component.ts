import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


import {Router, ActivatedRoute} from '@angular/router';

import {AlertService, AuthenticationService} from '../_services/index';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector   : 'login',
    templateUrl: 'login.component.html',
    styleUrls  : ['./login.component.scss'],
    animations : fuseAnimations
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;
    loginForm: FormGroup;
    loginFormErrors: any;
    // Private
    private _unsubscribeAll: Subject<any>;
    

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar : {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer : {
                    hidden: true
                }
            }
        };

        // Set the defaults
        this.loginFormErrors = {
            email   : {},
            password: {}
        };

        // Set the private defaults
        this._unsubscribeAll = new Subject();
            
        }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        
        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        this.loginForm.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.onLoginFormValuesChanged();
            });
        
    }
    
    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On form values changed
     */
    onLoginFormValuesChanged(): void
    {
        for ( const field in this.loginFormErrors )
        {
            if ( !this.loginFormErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.loginFormErrors[field] = {};

            // Get the control
            const control = this.loginForm.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.loginFormErrors[field] = control.errors;
            }
        }
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(
            data => {
                if (data.error) {
                    this.alertService.error(data.error);
                    this.loading = false;
                } else {
                    this.router.navigate([this.returnUrl]);
                }
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }
}
