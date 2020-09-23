import { Component, OnInit } from '@angular/core';
import {
  AuthenticationService,
  TokenPayload,
} from '../../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  credentials: TokenPayload = {
    email: '',
    password: '',
  };

  constructor(private auth: AuthenticationService, private router: Router) {}

  login() {
    this.auth.login(this.credentials).subscribe((data: any) => {
      console.log(data);
      if (data.success) {
        this.auth.saveToken(data.token);
        this.router.navigateByUrl('dashboard');
      } else {
        window.alert(data.message);
      }
    });
  }
}
