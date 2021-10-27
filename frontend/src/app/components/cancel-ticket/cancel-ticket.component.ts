import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RestEventsService } from 'src/app/services/rest-events.service';
import { RestLocationsService } from 'src/app/services/rest-locations.service';
import { RestProfilesService } from 'src/app/services/rest-profiles.service';

@Component({
  selector: 'app-cancel-ticket',
  templateUrl: './cancel-ticket.component.html',
  styleUrls: ['./cancel-ticket.component.css'],
})
export class CancelTicketComponent implements OnInit {
  form!: FormGroup;
  user!: any;
  ticket!: any;
  index!: any;
  quantity!: any;

  constructor(
    public restEvents: RestEventsService,
    public restProfile: RestProfilesService,
    public restLocations: RestLocationsService,
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params)=>{
      this.ticket = params['ticket'];
      this.index = params['index'];
      this.quantity = params['quantity'];
    });
    this.restProfile.getProfile().subscribe(
      (user) => {
        this.user = user;
        this.form = new FormGroup({
          name: new FormControl(
            {
              value: `${this.user.firstName}` + ' ' + `${this.user.lastName}`,
              disabled: true,
            },
            [Validators.required, Validators.pattern('^[A-Z]{1}[a-z]+$')]
          ),
          email: new FormControl({ value: this.user.email, disabled: true }, [
            Validators.required,
            Validators.pattern('^([A-Z]{1}[a-z]+[ ]{0,1})+$'),
          ]),
          quantity: new FormControl({ value: 1 }, [
            Validators.required,
            Validators.min(1),
            Validators.max(this.quantity)
          ])
        });
      },
      (err) => {
        this.auth.logout();
        this.router.navigate(['/home']);
      }
    );
  }

  submit(): void {
    if (this.form.valid) {      
      
      this.restProfile.cancelTicket(this.form.value.quantity, this.index, this.ticket).subscribe((ticket) => {
        alert('O seu bilhete foi cancelado com sucesso!');
        window.history.back();
      }, (err)=>{
        this.auth.logout();
        this.router.navigate(['/home']);
      });
    }
  }  

  back() {
    window.history.back();
  }
}
