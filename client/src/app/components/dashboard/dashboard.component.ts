import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../authentication.service';

interface response {
  email: string;
  validated: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  data: response ={
    validated: false,
    email: ''
  };

  constructor(private auth: AuthenticationService) {}

  ngOnInit(): void {
    this.auth.dashboard().subscribe((res: any) => {
      this.data = res;
    });
  }
}
