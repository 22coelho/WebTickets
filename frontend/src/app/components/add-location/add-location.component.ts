import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationModel } from 'src/app/model/Location';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RestEventsService } from 'src/app/services/rest-events.service';
import { RestLocationsService } from 'src/app/services/rest-locations.service';
import { RestProfilesService } from 'src/app/services/rest-profiles.service';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.css'],
})
export class AddLocationComponent implements OnInit {
  form!: FormGroup;
  locationData: LocationModel = new LocationModel();
  userId!: string;

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
        this.auth.verifyAdmin(user).subscribe(
          (auth) => {},
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
      latitude: new FormControl(null, [
        Validators.required,
        Validators.min(-999999999999),
        Validators.max(9999999999999),
      ]),
      longitude: new FormControl(null, [
        Validators.required,
        Validators.min(-9999999999999),
        Validators.max(9999999999999),
      ]),
      morada: new FormControl(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.pattern(
          '^([A-Z]{1}[A-Za-z]+(([ ]{0,1}[0-9A-Za-z])+[, ]{0,1}[a-z]*)*)$'
        ),
      ]),
    });
  }
  save() {
    if (localStorage.getItem('currentUser') != null) {
      if (this.form.valid) {
        this.locationData.name = this.form.value.name;
        this.locationData.lon = this.form.value.longitude;
        this.locationData.lat = this.form.value.latitude;
        this.locationData.address = this.form.value.morada;

        if (this.userId != undefined) {
          console.log(this.locationData);

          this.restLocations
            .addLocation(this.locationData, this.userId)
            .subscribe(
              (result) => {
                this.router.navigate(['/home']);
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
