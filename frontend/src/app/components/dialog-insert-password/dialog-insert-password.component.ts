import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RestProfilesService } from 'src/app/services/rest-profiles.service';

@Component({
  selector: 'app-dialog-insert-password',
  templateUrl: './dialog-insert-password.component.html',
  styleUrls: ['./dialog-insert-password.component.css'],
})
export class DialogInsertPasswordComponent implements OnInit {
  input!: FormGroup;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private rest: RestProfilesService
  ) {
    this.input = new FormGroup({
      password: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {}

  exit(): void {
    this.dialog.closeAll();
    this.router.navigate(['/home']);
  }

  verifyPassword(): void {
    if (localStorage.getItem('currentUser') != null) {
      if (
        this.input.get('password')?.touched &&
        this.input.get('password')?.dirty &&
        !this.input.get('password')?.invalid
      ) {
        this.rest.validatePassword(this.input.value).subscribe(
          (password: string) => {
            this.rest.setPassword(password);
            this.dialog.closeAll();
          },
          (err) => {
            this.input.reset();
            this.input.get('password')?.invalid;
          }
        );
      }
    } else {
      this.router.navigate(['/home']);
    }
  }
}
