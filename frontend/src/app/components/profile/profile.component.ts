import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from 'src/app/model/User';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RestEventsService } from 'src/app/services/rest-events.service';
import { RestProfilesService } from 'src/app/services/rest-profiles.service';
import {
  FormGroup,
  FormControl,
  Validators,
  //AbstractControl,
} from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DialogInsertPasswordComponent } from '../dialog-insert-password/dialog-insert-password.component';
import { MatDialog, MatDialogState } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  option: boolean = false;
  pw: string = '';
  currentUser?: any;
  form!: FormGroup;
  userData: UserModel = new UserModel();
  constructor(
    public rest: RestProfilesService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService,
    private dialog: MatDialog
  ) {
    this.form = new FormGroup({
      firstName: new FormControl(
        { value: this.currentUser?.firstName, disabled: true },
        [Validators.required, Validators.pattern('^[A-Z]{1}[a-z]+$')]
      ),
      lastName: new FormControl(
        { value: this.currentUser?.lastName, disabled: true },
        [Validators.required, Validators.pattern('^[A-Z]{1}[a-z]+$')]
      ),
      email: new FormControl(
        { value: this.currentUser?.email, disabled: true },
        [Validators.required, Validators.pattern('^([A-Z]{1}[a-z]+[ ]{0,1})+$')]
      ),
      password: new FormControl(
        { value: this.currentUser?.password, disabled: true },
        [Validators.required]
      ),
    });
  }

  ngOnInit(): void {
    this.dialog.open(DialogInsertPasswordComponent, { disableClose: true });

    const d = this.dialog.open(DialogInsertPasswordComponent, {
      disableClose: true,
    });

    d.afterClosed().subscribe(() => {
      let pw = this.rest.getPassword();
      this.form.patchValue({ password: pw?.password });
    });

    this.rest.getProfile().subscribe(
      (user) => {
        this.currentUser = user;
      },
      (err) => {
        this.router.navigate(['/login']);
        this.auth.logout();
      }
    );
  }

  sendPromoterRequest() {
    this.rest.sendRequest(this.currentUser).subscribe(
      (user) => {
        this.ngOnInit();
        window.location.reload();
      },
      (err) => {
        this.router.navigate(['/login']);
        this.auth.logout();
      }
    );
  }

  showHidden() {
    this.option = true;
    this.form.get('firstName')?.enable();
    this.form.get('lastName')?.enable();
    this.form.get('email')?.enable();
    this.form.get('password')?.enable();
  }

  cancel() {
    this.option = false;
    this.form.get('firstName')?.disable();
    this.form.get('lastName')?.disable();
    this.form.get('email')?.disable();
    this.form.get('password')?.disable();
    this.form.patchValue({
      firstName: this.currentUser?.firstName,
      lastName: this.currentUser?.lastName,
      email: this.currentUser?.email,
    });
  }

  submit() {
    if (localStorage.getItem('currentUser') != null) {
      if (this.form.touched) {
        this.userData.firstName = this.form.value.firstName;
        this.userData.lastName = this.form.value.lastName;
        this.userData.email = this.form.value.email;
        this.userData.password = this.form.value.password;
        if (this.currentUser != undefined) {
          this.rest.editProfile(this.userData).subscribe(
            (user) => {
              this.ngOnInit();
              window.location.reload();
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
      } else {
        window.location.reload();
      }
    } else {
      this.router.navigate(['/home']);
    }
  }

  deleteMe(id: string): void {
    this.rest.deleteMe(id).subscribe((err: any) => {
      return console.log(err);
    });
    localStorage.removeItem('currentUser');
    this.router.navigate(['/register']);
  }
}
