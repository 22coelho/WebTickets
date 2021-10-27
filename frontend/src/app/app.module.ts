import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddEventComponent } from './components/add-event/add-event.component';
import { AddLocationComponent } from './components/add-location/add-location.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { MyEventsComponent } from './components/my-events/my-events.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ShowUsersComponent } from './components/show-users/show-users.component';
import { ShowrequestsComponent } from './components/showrequests/showrequests.component';
import { MySavedEventsComponent } from './components/my-saved-events/my-saved-events.component';
import { EditEventComponent } from './components/edit-event/edit-event.component';
import { MoreinfoEventComponent } from './components/moreinfo-event/moreinfo-event.component';
import { DialogInsertPasswordComponent } from './components/dialog-insert-password/dialog-insert-password.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BuyticketComponent } from './components/buyticket/buyticket.component';
import { MyticketsComponent } from './components/mytickets/mytickets.component';
import { CancelTicketComponent } from './components/cancel-ticket/cancel-ticket.component';
import { GraphsComponent } from './components/graphs/graphs.component';
import { AllEventsComponent } from './components/all-events/all-events.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    AddEventComponent,
    AddLocationComponent,
    LoginComponent,
    RegisterComponent,
    MyEventsComponent,
    ProfileComponent,
    ShowUsersComponent,
    ShowrequestsComponent,
    MySavedEventsComponent,
    EditEventComponent,
    MoreinfoEventComponent,
    DialogInsertPasswordComponent,
    BuyticketComponent,
    MyticketsComponent,
    CancelTicketComponent,
    GraphsComponent,
    AllEventsComponent,
  ],
  entryComponents: [DialogInsertPasswordComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatToolbarModule,
    MatProgressSpinnerModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
