import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RestEventsService } from 'src/app/services/rest-events.service';
import { RestProfilesService } from 'src/app/services/rest-profiles.service';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css'],
})
export class MyEventsComponent implements OnInit {
  userId!: string;
  myevents: any = [];
  savedevents: number = 0;
  publishedevents: number = 0;

  constructor(
    public restEvents: RestEventsService,
    public restProfile: RestProfilesService,
    private auth: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.restProfile.getProfile().subscribe(
      (user) => {
        this.userId = user._id;
        this.getAllMyEvents();
      },
      (err) => {
        this.auth.logout();
        this.router.navigate(['/login']);
      }
    );
  }

  getAllMyEvents(): void {
    this.myevents = [];

    this.restEvents.getAllMyEvents().subscribe(
      (data: {}) => {
        this.myevents = data;
        this.getNotPublishedEvents();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  getNotPublishedEvents(): void {
    for (let event of this.myevents) {
      if (event.published == false) {
        this.savedevents++;
      } else {
        this.publishedevents++;
      }
    }
  }
}
