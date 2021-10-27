import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  user: FormGroup = new FormGroup({
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

  login(): void { 
    
    this.auth.login(this.user.value).subscribe(
      (user: any) => {
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.router.navigate(['/home']);
        }
      },
      (err) => {
        alert('Erro no login!');
      }
    );
  }
}
