import { NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/model/User';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RestProfilesService } from 'src/app/services/rest-profiles.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  currentUser?: UserModel;

  constructor(
    private route: Router,
    private auth: AuthenticationService,
    private restProfile: RestProfilesService
  ) {}

  ngOnInit(): void {    
    if (localStorage.getItem('currentUser') !== null) {
      this.restProfile.getProfile().subscribe((user) => {
        this.currentUser = user;
      });
    }
  }

  getUrl(): string {
    return this.route.url;
  }

  logout() {
    this.auth.logout();
    window.location.reload();
  }

  login() {
    this.route.navigate(['/login']);
  }
  register(){
    this.route.navigate(['/register']);
  }
}
