import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestProfilesService } from 'src/app/services/rest-profiles.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserModel } from 'src/app/model/User';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-mytickets',
  templateUrl: './mytickets.component.html',
  styleUrls: ['./mytickets.component.css']
})
export class MyticketsComponent implements OnInit {
  currentUser!: any;
  userData: UserModel = new UserModel();
  mytickets!: any;

  constructor(    
    private route: ActivatedRoute,
    private router: Router,
    public rest: RestProfilesService,
    private auth: AuthenticationService) { }

  ngOnInit(): void {
    this.rest.getProfile().subscribe(
      (user) => {
        this.currentUser = user;
        this.showMyTickets();
      },
      (err) => {
        this.router.navigate(['/login']);
        this.auth.logout();
      }
    );
  }

  download(ticket : any,index: number): void{
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', `${this.mytickets[index].Teste}`);
    link.setAttribute('download', this.mytickets[index].Teste);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  

  showMyTickets() : void{
    this.rest.showMyTickets().subscribe(
      (tickets) => {
        this.mytickets = tickets;
      },
      (err) => {
        this.router.navigate(['/login']);
        this.auth.logout();
      }
    );
  }

  cancelticket(ticket: any, index: number){    
    this.router.navigate(['/cancelticket'], { queryParams: {quantity: ticket.Quantidade.toString(), index: index.toString(), ticket: JSON.stringify(ticket)}});
  }
  

}
