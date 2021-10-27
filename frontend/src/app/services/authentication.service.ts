import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserModel } from '../model/User';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  login(user: FormGroup): Observable<any> {
    return this.http.post<any>(
      'http://localhost:3000/login',
      JSON.stringify(user),
      httpOptions
    );
  }

  register(user: FormGroup): Observable<any> {
    return this.http.post<any>(
      'http://localhost:3000/register',
      JSON.stringify(user),
      httpOptions
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
  }

  verifyAdmin(user: UserModel) {
    return this.http.post<UserModel>(
      'http://localhost:3000/verify-auth-admin',
      UserModel
    );
  }
  verifyPromoter(user: UserModel) {
    return this.http.post<UserModel>(
      'http://localhost:3000/verify-auth-promoter',
      UserModel
    );
  }
}
