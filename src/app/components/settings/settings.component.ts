import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  imports: [CommonModule, FormsModule],
})
export class SettingsComponent implements OnInit {
  user = { name: '', email: '' };

  showMessage = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
   showConfirm = false; 

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    const userData = this.userService.getUser();
    if (userData) {
      this.user = { ...userData };
    }
  }

  saveProfile() {
    console.log('Profile Updated:', this.user);
    this.showPopup('Profile updated successfully!', 'success');
  }

  deleteAccount() {
    this.showConfirm = true;
    this.showPopup('Are you sure you want to delete your account? This action cannot be undone.', 'error');
  }

  confirmDelete(yes: boolean) {
    if (yes) {
      localStorage.removeItem('registeredUser');
      this.userService.clearUser();
      this.showConfirm = false;
      this.showPopup('Your account has been deleted.', 'success');

      setTimeout(() => {
        this.router.navigate(['/signup']);
      }, 1000);
    } else {
      this.showConfirm = false;
      this.showMessage = false;
    }
  }

  logout() {
    console.log('User logged out');
    this.userService.clearUser();
    this.router.navigate(['/login']);
  }

  closeMessageBox() {
    this.showMessage = false;
    this.showConfirm = false;
  }

  private showPopup(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageType = type;
    this.showMessage = true;
  }
}
