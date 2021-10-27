import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestEventsService } from '../../services/rest-events.service';
import { RestLocationsService } from '../../services/rest-locations.service';
import { EventModel } from '../../model/Event';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { RestProfilesService } from 'src/app/services/rest-profiles.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserModel } from 'src/app/model/User';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css'],
})
export class AddEventComponent implements OnInit {
  form!: FormGroup;
  imageData!: string;
  file!: File;
  eventData: EventModel = new EventModel();
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
        this.auth.verifyPromoter(user).subscribe(
          (auth) => {
          },
          (err) => {
            this.router.navigate(['/home']);
          }
        );
      },
      (err) => {
        this.auth.logout();
        this.router.navigate(['/login']);
      }
    );

    this.form = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.pattern('^([A-Z]{1}[A-Za-z]+(([ ]{0,1}[A-Za-z])+[a-z]*)*)$'),
      ]),
      description: new FormControl(null, [
        Validators.required,
        Validators.pattern('^([A-Z]{1}[a-z]+([ ]{0,1}[A-Za-z])*.)$'),
      ]),
      date: new FormControl(null, [Validators.required]),
      location: new FormControl(null, [Validators.required]),
      capacity: new FormControl(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(9999),
      ]),
      ticketPrice: new FormControl(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(9999),
      ]),
    });
    this.getlocations();
  }

  selectImage(event: Event) {
    let e = event.target as HTMLInputElement;
    if (e.files!.length > 0) {
      const file = e.files![0];
      if (file.size > 1000000) {
        alert('Imagem muito grande, introduza outra!');
      } else {
        this.file = file;
      }
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
          this.eventData.owner = this.userId;
          this.eventData.imagem = this.file;
          this.restEvents.addEvent(this.eventData).subscribe(
            (result) => {
              this.router.navigate(['/myevents']);
            },
            (err) => {
              console.log(err);

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
