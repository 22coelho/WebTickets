import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  UrlSegment,
} from '@angular/router';
import { EventModel } from 'src/app/model/Event';
import { RestEventsService } from 'src/app/services/rest-events.service';
import { RestProfilesService } from 'src/app/services/rest-profiles.service';

@Component({
  selector: 'app-moreinfo-event',
  templateUrl: './moreinfo-event.component.html',
  styleUrls: ['./moreinfo-event.component.css'],
})
export class MoreinfoEventComponent implements OnInit {
  event!: any;
  url: any;
  hasLoaded: boolean = false;

  constructor(
    public restEvents: RestEventsService,
    public restProfile: RestProfilesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getEvent(this.route.snapshot.params['ide']);
  }

  getEvent(ide: string): void {
    this.restEvents.getEvent(ide).subscribe(
      (data: {}) => {
        this.event = data;
        this.getOwner(this.event._id);
        this.hasLoaded = true;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getOwner(id: string): void {
    this.restProfile.getOwnerEvent(id).subscribe(
      (data) => {
        this.event.owner = data.firstName + ' ' + data.lastName;
        this.event.contacto = data.email;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  back() {
    window.history.back();
  }

  buyticket(id: string) {
    this.router.navigate([`/buyticket/${id}`]);
  }
}
