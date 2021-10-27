import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserModel } from '../model/User';

const endpoint = 'http://localhost:3000/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class RestProfilesService {
  pw: any;
  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserModel> {
    return this.http.get<UserModel>(endpoint + 'profile');
  }

  setPassword(password: any): void {
    this.pw = password;
  }
  getPassword(): any {
    return this.pw;
  }

  getUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(endpoint + 'users');
  }

  getUser(id: string): Observable<UserModel> {
    return this.http.get<UserModel>(endpoint + `userprofile/${id}`);
  }

  getOwnerEvent(id: string): Observable<UserModel>{
    console.log(id);
    return this.http.get<UserModel>(endpoint + `getowner/${id}`);
  }

  editProfile(user: UserModel): Observable<any> {
    return this.http.put<any>(endpoint + 'edit-profile', user);
  }

  refuseRequest(id: string): Observable<any> {
    return this.http.put<any>(
      endpoint + `users/refuserequest/${id}`,
      httpOptions
    );
  }

  acceptRequest(id: string): Observable<any> {
    return this.http.put<any>(
      endpoint + `users/acceptrequest/${id}`,
      httpOptions
    );
  }

  sendRequest(user: UserModel): Observable<UserModel> {
    return this.http.put<any>(endpoint + 'users/sendrequest', user);
  }

  deleteUser(id: string): Observable<UserModel> {
    return this.http.delete<UserModel>(endpoint + `users/deleteuser/${id}`);
  }

  deleteMe(id: string): Observable<UserModel> {
    return this.http.delete<UserModel>(endpoint + `users/deleteme/${id}`);
  }

  showMyTickets(): Observable<any> {
    return this.http.get<any>(endpoint + `users/mytickets`);
  }

  cancelTicket(quantity: number, index: any, ticket: any): Observable<any> {

    return this.http.post<any>(
      endpoint + 'users/cancelticket',
      { quantity: quantity, index: index, ticket: ticket },
      httpOptions
    );
  }

  validatePassword(input: FormGroup): Observable<any> {
    return this.http.post<any>(
      endpoint + 'verify-password',
      JSON.stringify(input),
      httpOptions
    );
  }
}
