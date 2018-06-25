import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
    fuseConfig: any;
    
    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        
        console.log('username' + username);
        
        //const body = {login: username, password: password};
        //return this.http.post<any>('/apps/api/rest.php', {login: username, password: password})
        return this.http.get<any>('http://genplan1/apps/api/rest.php?action=oauth&do=login&login=' + username + '&password=' + password)
            .map(user => {
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