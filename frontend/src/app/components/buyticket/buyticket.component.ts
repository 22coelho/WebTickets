import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventModel } from 'src/app/model/Event';
import { UserModel } from 'src/app/model/User';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RestEventsService } from 'src/app/services/rest-events.service';
import { RestLocationsService } from 'src/app/services/rest-locations.service';
import { RestProfilesService } from 'src/app/services/rest-profiles.service';

@Component({
  selector: 'app-buyticket',
  templateUrl: './buyticket.component.html',
  styleUrls: ['./buyticket.component.css'],
})
export class BuyticketComponent implements OnInit {
  form!: FormGroup;
  user!: UserModel;
  event!: any;
  file!: File;

  constructor(
    public restEvents: RestEventsService,
    public restProfile: RestProfilesService,
    public restLocations: RestLocationsService,
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private router: Router
  ) {
    this.restEvents.getEvent(this.route.snapshot.params['ide']).subscribe(
      (data: {}) => {
        this.event = data;
        this.getOwner(this.event.owner);
        this.restProfile.getProfile().subscribe(
          (user) => {
            this.user = user;
            this.form = new FormGroup({
              name: new FormControl(
                {
                  value:
                    `${this.user.firstName}` + ' ' + `${this.user.lastName}`,
                  disabled: true,
                },
                [Validators.required, Validators.pattern('^[A-Z]{1}[a-z]+$')]
              ),
              email: new FormControl(
                { value: this.user.email, disabled: true },
                [
                  Validators.required,
                  Validators.pattern('^([A-Z]{1}[a-z]+[ ]{0,1})+$'),
                ]
              ),
              quantity: new FormControl({ value: 1 }, [
                Validators.required,
                Validators.min(1),
                Validators.max(this.event.capacity),
              ]),
              nif: new FormControl({}, [
                Validators.required,
                Validators.pattern('^\\d{9}$'),
              ]),
              file : new FormControl(null,[
                Validators.required,
              ])

            });
          },
          (err) => {
            this.auth.logout();
            this.router.navigate(['/home']);
          }
        );
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  ngOnInit(): void {}

  selectImage(event: Event) {
    let e = event.target as HTMLInputElement;
    if (e.files!.length > 0) {
      const file = e.files![0];
      if(file.size > 1000000){
        alert("Imagem muito grande, introduza outra!")
      } else {
        this.file = file;
      }
    }
  }

  submit(): void {
    if (this.form.valid) {
      this.restEvents
        .buyTicket(this.route.snapshot.params['ide'], this.form,this.file)
        .subscribe(
          (event) => {
            alert('O seu bilhete foi comprado!');
            window.history.back();
          },
          (err) => {
            this.auth.logout();
            this.router.navigate(['/home']);
          }
        );
    }
  }

  getOwner(id: string): void {
    this.restProfile.getUser(id).subscribe(
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
}
