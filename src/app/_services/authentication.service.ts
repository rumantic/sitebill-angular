import {Injectable, isDevMode} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import {currentUser} from 'app/_models/currentuser';


@Injectable()
export class AuthenticationService {
    fuseConfig: any;
    api_url: string;
    private currentUser: currentUser;
    

    constructor(private http: HttpClient) {
        if (isDevMode()) {
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
                //console.log('auth:login');
                //console.log(user);
                // login successful if there's a jwt token in the response
                if (user && user.session_key) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
                return user;
            });
    }

    logout() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];
        
        const body = {action: 'oauth', do: 'logout', session_key: this.currentUser.session_key};
        const url = `${this.api_url}/apps/api/rest.php`;

        return this.http.post<any>(url, body)
            .map(response => {
                // login successful if there's a jwt token in the response
                if (response.state == 'success') {
                    // remove user from local storage to log user out
                    localStorage.removeItem('currentUser');
                }
            });

    }
}