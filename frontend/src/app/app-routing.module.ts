import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guard/auth.guard';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';

import { AddEventComponent } from './components/add-event/add-event.component';
import { EditEventComponent } from './components/edit-event/edit-event.component';
import { MyEventsComponent } from './components/my-events/my-events.component';
import { MySavedEventsComponent } from './components/my-saved-events/my-saved-events.component';
import { MoreinfoEventComponent } from './components/moreinfo-event/moreinfo-event.component';
import { BuyticketComponent } from './components/buyticket/buyticket.component';
import { AddLocationComponent } from './components/add-location/add-location.component';
import { MyticketsComponent } from './components/mytickets/mytickets.component';

import { ShowUsersComponent } from './components/show-users/show-users.component';
import { ShowrequestsComponent } from './components/showrequests/showrequests.component';
import { CancelTicketComponent } from './components/cancel-ticket/cancel-ticket.component';
import { GraphsComponent } from './components/graphs/graphs.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'add-event', component: AddEventComponent, canActivate: [AuthGuard] },
  {
    path: 'edit-event/:ide',
    component: EditEventComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-location',
    component: AddLocationComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'myevents', component: MyEventsComponent, canActivate: [AuthGuard] },
  {
    path: 'mysavedevents',
    component: MySavedEventsComponent,
    canActivate: [AuthGuard],
  },
  { path: 'moreinfo/:ide', component: MoreinfoEventComponent },
  {
    path: 'show-users',
    component: ShowUsersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'showrequests',
    component: ShowrequestsComponent,
    canActivate: [AuthGuard],
  },
  { path: 'buyticket/:ide', component: BuyticketComponent },
  { path: 'cancelticket', component: CancelTicketComponent },
  {
    path: 'mytickets',
    component: MyticketsComponent,
    canActivate: [AuthGuard],
  },
  { path: 'graph', component: GraphsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
