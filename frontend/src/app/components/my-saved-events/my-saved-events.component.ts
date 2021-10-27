import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RestEventsService } from 'src/app/services/rest-events.service';
import { RestProfilesService } from 'src/app/services/rest-profiles.service';

@Component({
  selector: 'app-my-saved-events',
  templateUrl: './my-saved-events.component.html',
  styleUrls: ['./my-saved-events.component.css'],
})
export class MySavedEventsComponent implements OnInit {
  userId!: string;
  myevents: any = [];

  constructor(
    public restEvents: RestEventsService,
    public restProfile: RestProfilesService,
    private auth: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllMyEvents();
  }

  getAllMyEvents(): void {
    this.restEvents.getAllMyEvents().subscribe(
      (data: {}) => {
        this.myevents = data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  deleteEvent(ide: string): void {
    this.restEvents.deleteEvent(ide).subscribe((err: any) => {
      console.log(err);
    });
    window.location.reload();
  }

  publishEvent(ide: string): void {
    this.restEvents.publishEvent(ide).subscribe(
      (event) => {
        this.router.navigate(['/myevents']);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
}
