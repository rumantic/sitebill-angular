import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
    fuseConfig: any;
    api_url: string;
    
    constructor(private http: HttpClient) { 
        if(isDevMode()) {
            this.api_url = 'http://genplan1';
        } else {
            this.api_url = '';
        }
    }

    login(domain: string, username: string, password: string) {
        
        //console.log('username' + username);
        
        //const body = {login: username, password: password};
        //return this.http.post<any>('/apps/api/rest.php', {login: username, password: password})
        //const url = `${this.api_url}/apps/apiproxy/restproxy.php`;
        const url = `${this.api_url}/apps/api/rest.php`;
        
        const login_request = {action: 'oauth', do: 'login', proxysalt: '123', domain: domain, login: username, password: password};
        
        return this.http.post<any>(url, login_request)
            .map(user => {
                //console.log(user);
                // login successful if there's a jwt token in the response
                if (user && user.session_key && user.admin_panel_login) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
                return user;
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}