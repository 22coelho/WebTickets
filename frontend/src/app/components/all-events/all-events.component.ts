import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventModel } from 'src/app/model/Event';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LoadingCircleService } from 'src/app/services/loading-circle.service';
import { RestEventsService } from 'src/app/services/rest-events.service';
import { RestProfilesService } from 'src/app/services/rest-profiles.service';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.css'],
})
export class AllEventsComponent implements OnInit {
  events: any;
  userId: any;
  format_dates: any;
  loading = this.loader.loading$;

  constructor(
    public rest: RestEventsService,
    private route: ActivatedRoute,
    private router: Router,
    private restProfile: RestProfilesService,
    private auth: AuthenticationService,
    private loader: LoadingCircleService
  ) {}

  ngOnInit(): void {
    this.loader.show();
    this.restProfile.getProfile().subscribe(
      (user) => {
        this.userId = user._id;
      },
      (err) => {
        this.auth.logout();
      }
    );
    this.getEvents();
  }
  getEvents(): void {
    this.events = [];
    this.rest.getAllEvents().subscribe(
      (data: {}) => {
        this.events = data;
        this.formatDates(this.events);
        this.loader.hide();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  formatDates(events: EventModel[]): void {
    this.format_dates = [];

    for (let i = 0; i < events.length; i++) {
      let d = new Date(events[i].date);
      this.events[i].date = d.toLocaleDateString();
    }
  }
}
