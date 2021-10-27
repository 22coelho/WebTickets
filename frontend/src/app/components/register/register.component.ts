import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  user: FormGroup = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.pattern('^[A-Z]{1}[a-z]{2,8}$'),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.pattern('^[A-Z]{1}[a-z]{2,8}$'),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(16),
    ]),
  });

  constructor(
    public auth: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('currentUser') != null) {
      this.router.navigate(['/home']);
    }
  }

  register(): void {
    if (this.user.valid) {
      this.auth.register(this.user.value).subscribe(
        (user: any) => {
          if (user && user.token) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            console.log(user);
            this.router.navigate(['/home']);
          }
        },
        (err) => {
          if (err.status == 409) {
            alert('Email já em uso.');
          }
          if (err.status == 400) {
            alert('Informação incorreta inserida.');
          }
        }
      );
    }
  }
}
