import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { EventModel } from '../model/Event';
import { LocationModel } from '../model/Location';
import { FormGroup } from '@angular/forms';

const endpoint = 'http://localhost:3000/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class RestEventsService {
  constructor(private http: HttpClient) {}

  addEvent(evento: EventModel): Observable<any> {
    const eventoData = new FormData();

    eventoData.append('name', evento.name);
    eventoData.append('location', evento.location);
    eventoData.append('date', evento.date);
    eventoData.append('ticketPrice', String(evento.ticketPrice));
    eventoData.append('capacity', String(evento.capacity));
    eventoData.append('description', evento.description);
    eventoData.append('owner', evento.owner);
    eventoData.append('imagem', evento.imagem);

    return this.http.post<any>(
      `http://localhost:3000/${eventoData.get('owner')}/event`,
      eventoData
    );
  }

  getAllEvents(): Observable<EventModel[]> {
    return this.http.get<EventModel[]>(endpoint + 'events');
  }

  getAllMyEvents(): Observable<EventModel[]> {
    return this.http.get<EventModel[]>(endpoint + 'myevents');
  }

  deleteEvent(ide: string): Observable<EventModel> {
    return this.http.delete<EventModel>(
      endpoint + `myevents/${ide}`,
      httpOptions
    );
  }

  getEvent(ide: string): Observable<any> {
    return this.http.get<any>(endpoint + `editevent/${ide}`);
  }

  editEvent(ide: string, evento: EventModel): Observable<any> {
    const eventoData = new FormData();

    eventoData.append('name', evento.name);
    eventoData.append('location', evento.location);
    eventoData.append('date', evento.date);
    eventoData.append('ticketPrice', String(evento.ticketPrice));
    eventoData.append('capacity', String(evento.capacity));
    eventoData.append('description', evento.description);
    eventoData.append('owner', evento.owner);
    eventoData.append('imagem', evento.imagem);
    eventoData.append('_id', ide);

    return this.http.post<any>(endpoint + `myevents/${ide}`, eventoData);
  }

  publishEvent(ide: string): Observable<any> {
    return this.http.put<any>(
      endpoint + `myevents/publish/${ide}`,
      httpOptions
    );
  }

  buyTicket(ide: string, form: FormGroup, file : File): Observable<any> {
    const ticketData = new FormData();
    ticketData.append('nif', form.value.nif);
    ticketData.append('quantity', form.value.quantity);
    ticketData.append('file', file);

    return this.http.post<any>(endpoint + `buyticket/${ide}`, ticketData);
  }
}
