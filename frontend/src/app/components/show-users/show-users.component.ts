import { Component, OnInit } from '@angular/core';
import { RestProfilesService } from 'src/app/services/rest-profiles.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from 'src/app/model/User';

@Component({
  selector: 'app-show-users',
  templateUrl: './show-users.component.html',
  styleUrls: ['./show-users.component.css'],
})
export class ShowUsersComponent implements OnInit {
  users: any = [];
  userId!: string;
  n_requests: number = 0;

  constructor(
    public rest: RestProfilesService,
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rest.getProfile().subscribe(
      (user) => {
        this.userId = user._id;
        this.auth.verifyAdmin(user).subscribe(
          (user) => {
            this.getUsers();
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
  }

  getUsers(): void {
    this.users = [];
    this.rest.getUsers().subscribe(
      (data) => {
        this.users = data;
        this.contRequests();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  contRequests(): void {
    this.n_requests = 0;
    for (let user of this.users) {
      if (user != null) {
        if (user.sentRequest == true && user.typeUser == 'client') {
          this.n_requests++;
        }
      }
    }
  }

  showRequests(): void {
    this.router.navigate(['/showrequests']);
  }
  showdashboards(): void {
    this.router.navigate(['/graph']);
  }

  deleteUser(id: string): void {
    this.rest.deleteUser(id).subscribe((err: any) => {
      return console.log(err);
    });
    window.location.reload();
  }
}
