import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { LocationModel } from '../model/Location';

const endpoint = 'http://localhost:3000/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class RestLocationsService {
  constructor(private http: HttpClient) {}

  getAllLocations(): Observable<LocationModel[]> {
    return this.http.get<LocationModel[]>(endpoint + 'locations');
  }
  addLocation(location: LocationModel, id: string): Observable<any> {
    return this.http.post<any>(
      `http://localhost:3000/${id}/local`,
      location, httpOptions
    );
  }
}
