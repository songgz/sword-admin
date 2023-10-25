import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, map} from "rxjs";
import {User} from "../models/user";
import {GlobalComponent} from "../../global-component";

import {RestApiService} from "./rest-api.service";

//const AUTH_API = GlobalComponent.AUTH_API;
//const httpOptions = {
//  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
//};
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user!: User;
  currentUserValue: any;

  //private currentUserSubject: BehaviorSubject<User>;
  // public currentUser: Observable<User>;

  constructor(private rest: RestApiService) {
    //this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')!));
    // this.currentUser = this.currentUserSubject.asObservable();
  }



  /**
   * Performs the auth
   * @param email email of user
   * @param password password of user
   */
  login(userid: string, password: string) {
    return this.rest.post(`/auth/sign_in`, { userid, password }).pipe(map(body => {
      // login successful if there's a jwt token in the response
      if (body && body.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('toast', 'true');
        localStorage.setItem('currentUser', JSON.stringify(body.user));
        localStorage.setItem('token', body.token);
        //this.currentUserSubject.next(user);
      }
      return body.user;
    }));


    // return getFirebaseBackend()!.loginUser(email, password).then((response: any) => {
    //     const user = response;
    //     return user;
    // });

    // return this.http.post(AUTH_API + 'signin', {
    //   email,
    //   password
    // }, httpOptions);
    // this.rest.post('signin', {
    //   userid: userid,
    //   password: password
    // }).subscribe(body => {
    //
    // });
  }



  /**
   * Returns the current user
   */
  public currentUser(): any {
    //return getFirebaseBackend()!.getAuthenticatedUser();
  }

  /**
   * Logout the user
   */
  logout() {
    // logout the user
    // return getFirebaseBackend()!.logout();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    //this.currentUserSubject.next(null!);
  }

  /**
   * Reset password
   * @param email email
   */
  resetPassword(email: string) {
    // return getFirebaseBackend()!.forgetPassword(email).then((response: any) => {
    //   const message = response.data;
    //   return message;
    // });
  }
}
