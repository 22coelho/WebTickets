import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RestProfilesService } from 'src/app/services/rest-profiles.service';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css'],
})
export class GraphsComponent implements OnInit {
  constructor(
    public rest: RestProfilesService,
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rest.getProfile().subscribe(
      (user) => {
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
  }

  back() {
    window.history.back();
  }
}
