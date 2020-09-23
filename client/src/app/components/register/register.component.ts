import { Component, OnInit } from '@angular/core';
import {
  AuthenticationService,
  TokenPayload,
} from '../../authentication.service';
import { Router } from '@angular/router';
// import { compileNgModule, R3TargetBinder } from '@angular/compiler';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  credentials: TokenPayload = {
    email: '',
    password: '',
  };

  constructor(private auth: AuthenticationService, private router: Router) {
    if (auth.isLoggedIn()) {
      router.navigateByUrl('dashboard');
    }
  }

  register() {
    this.auth.register(this.credentials).subscribe((data: any) => {
      console.log(data);
      if (data.success) {
        this.auth.saveToken(data.token);
        this.router.navigateByUrl('dashboard');
      } else {
        window.alert(data.error);
      }
    });
  }
}
