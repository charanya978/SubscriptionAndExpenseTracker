import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';

  showMessage = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private router: Router, private userService: UserService) {}

  signup() {
    if (!this.username.trim() || !this.email.trim() || !this.password || !this.confirmPassword) {
      this.showPopup('Please fill in all fields.', 'error');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.showPopup('Passwords do not match!', 'error');
      return;
    }

    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

    const userExists = users.some(
      (u: any) =>
        u.email.toLowerCase() === this.email.toLowerCase() ||
        u.username.toLowerCase() === this.username.toLowerCase()
    );

    if (userExists) {
      this.showPopup('Username or email already exists.', 'error');
      return;
    }

    const newUser = {
      username: this.username,
      email: this.email,
      password: this.password,
    };

    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser)); // track logged in user

    this.userService.setUser(this.username, this.email);
    this.showPopup('Signup successful!', 'success');

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
