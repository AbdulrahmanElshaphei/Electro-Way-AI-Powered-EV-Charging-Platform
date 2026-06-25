import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email    = '';
  password = '';
  errorMsg = '';
  loading  = false;
  showPass = false;

  constructor(private auth: AuthService) {}

  fillCreds(email: string, pass: string) {
    this.email    = email;
    this.password = pass;
    this.errorMsg = '';
  }

  login() {
    this.errorMsg = '';
    if (!this.email || !this.password) {
      this.errorMsg = 'Please enter your email and password.';
      return;
    }
    this.loading = true;
    // Simulate slight delay for UX
    setTimeout(() => {
      const result = this.auth.login(this.email, this.password);
      this.loading = false;
      if (result.success) {
        this.auth.redirectAfterLogin();
      } else {
        this.errorMsg = result.message || 'Login failed.';
      }
    }, 600);
  }
}
