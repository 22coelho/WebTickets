import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventModel } from 'src/app/model/Event';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RestEventsService } from 'src/app/services/rest-events.service';
import { RestLocationsService } from 'src/app/services/rest-locations.service';
import { RestProfilesService } from 'src/app/services/rest-profiles.service';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css'],
})
export class EditEventComponent implements OnInit {
  form!: FormGroup;
  imageData!: string;
  file!: File;
  eventData!: any;
  userId!: string;
  locations: any;

  constructor(
    public restEvents: RestEventsService,
    public restProfile: RestProfilesService,
    public restLocations: RestLocationsService,
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.restProfile.getProfile().subscribe(
      (user) => {
        this.userId = user._id;
      },
      (err) => {
        this.auth.logout();
        this.router.navigate(['/login']);
      }
    );

    this.getEvent(this.route.snapshot.params['ide']);
    this.getlocations();
  }

  selectImage(event: Event) {
    let e = event.target as HTMLInputElement;
    if (e.files!.length > 0) {
      const file = e.files![0];
      this.file = file;
      
    }
  }

  getlocations(): void {
    this.locations = [];
    this.restLocations.getAllLocations().subscribe(
      (data: {}) => {
        this.locations = data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getEvent(ide: string): void {    
    this.restEvents.getEvent(ide).subscribe(
      (data: {}) => {
        this.eventData = data;

        this.form = new FormGroup({
          name: new FormControl(this.eventData.name, [
            Validators.required,
            Validators.pattern('^([A-Z]{1}[A-Za-z]+(([ ]{0,1}[A-Za-z])+[a-z]*)*)$'),
          ]),
          description: new FormControl(this.eventData.description, [
            Validators.required,
            Validators.pattern('^([A-Z]{1}[A-Za-z]+(([ ]{0,1}[0-9A-Za-z])+[, ]{0,1}[a-z]*)*)$'),
          ]),
          date: new FormControl(new Date(this.eventData.date).toISOString().slice(0, -1), [Validators.required]),
          location: new FormControl((this.eventData.location.name), [
            Validators.required,
          ]),
          capacity: new FormControl(this.eventData.capacity, [
            Validators.required,
            Validators.min(1),
            Validators.max(9999),
          ]),
          ticketPrice: new FormControl(this.eventData.ticketPrice, [
            Validators.required,
            Validators.min(1),
            Validators.max(9999),
          ]),
        });
      },
      (err: any) => {        
        console.log(err);
      }
    );
  }

  save() {
    if (localStorage.getItem('currentUser') != null) {
      if (this.form.valid) {
        this.eventData.capacity = this.form.value.capacity;
        this.eventData.date = this.form.value.date;
        this.eventData.description = this.form.value.description;
        this.eventData.location = this.form.value.location;
        this.eventData.name = this.form.value.name;
        this.eventData.ticketPrice = this.form.value.ticketPrice;

        if (this.userId != undefined) {
          this.eventData.imagem = this.file;
          this.restEvents.editEvent(this.eventData._id, this.eventData).subscribe(
            (result) => {
              this.router.navigate(['/mysavedevents']);
            },
            (err) => {
              this.router.navigate(['/login']);
              this.auth.logout();
            }
          );
        } else {
          this.router.navigate(['/login']);
          this.auth.logout();
        }
      }
    } else {
      this.router.navigate(['/home']);
    }
  }
}
