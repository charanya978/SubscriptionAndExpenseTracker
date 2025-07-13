import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';

  showMessage = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private router: Router, private userService: UserService) {}

  login() {
    if (!this.email.trim() || !this.password.trim()) {
      this.showPopup('Please fill in all fields.', 'error');
      return;
    }

    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = users.find(
      (u: any) => u.email.toLowerCase() === this.email.toLowerCase() && u.password === this.password
    );

    if (!user) {
      this.showPopup('Invalid credentials or user not found.', 'error');
      return;
    }

    localStorage.setItem('currentUser', JSON.stringify(user));
    this.userService.setUser(user.username, user.email);
    this.showPopup('Login successful!', 'success');

    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 1000);
  }

  closeMessageBox() {
    this.showMessage = false;
  }

  private showPopup(message: string, type: 'success' | 'error') {
    this.message = message;
    this.messageType = type;
    this.showMessage = true;
  }
}
