import { Component, OnInit } from '@angular/core';
import { RestProfilesService } from 'src/app/services/rest-profiles.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from 'src/app/model/User';

@Component({
  selector: 'app-showrequests',
  templateUrl: './showrequests.component.html',
  styleUrls: ['./showrequests.component.css'],
})
export class ShowrequestsComponent implements OnInit {
  users: any;
  userId!: string;
  requests: any;

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
        this.getUsers();
      },
      (err) => {
        this.auth.logout();
        this.router.navigate(['/login']);
      }
    );
    this.getUsers();
  }

  getUsers(): void {
    this.users = [];

    this.rest.getUsers().subscribe(
      (data: {}) => {
        this.users = data;
        this.showRequests();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  refuseRequest(id: string): void{

    this.rest.refuseRequest(id).subscribe(
      (data: {}) => {

        window.location.reload();
      },
      (err: any) => {
        console.log(err);
      }
    );
    
  }

  acceptRequest(id: string): void{

    this.rest.acceptRequest(id).subscribe(
      (data: {}) => {

        window.location.reload();
      },
      (err: any) => {
        console.log(err);
      }
    );
    
  }

  showRequests(): void {
    this.requests = [];

    for (let user of this.users) {
      if (user != null) {
        if (user.sentRequest == true && user.typeUser == 'client') {
          this.requests.push(user);
        }
      }
    }
  }
}
