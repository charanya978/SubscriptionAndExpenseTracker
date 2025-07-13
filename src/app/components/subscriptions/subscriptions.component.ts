import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css'],
  imports: [CommonModule, FormsModule],
})
export class SubscriptionsComponent {
  subscriptions: any[] = [];
  newSubscription = { name: '', price: 0, renewalDate: '' };

  constructor(private dataService: DataService, private userService: UserService) {
    const currentUser = this.userService.getUser();
    this.dataService.subscriptions$.subscribe(all => {
      this.subscriptions = all.filter(sub => sub.userEmail === currentUser?.email);
    });
  }

  addSubscription() {
    if (!this.newSubscription.name || this.newSubscription.price <= 0 || !this.newSubscription.renewalDate) {
      alert('Please fill in all fields.');
      return;
    }

    const userEmail = this.userService.getUser()?.email;
    if (!userEmail) return;

    const newSub = {
      id: Date.now(),
      name: this.newSubscription.name,
      price: this.newSubscription.price,
      renewalDate: new Date(this.newSubscription.renewalDate),
      userEmail,
    };

    this.subscriptions.push(newSub);
    this.saveSubscriptions();
    this.newSubscription = { name: '', price: 0, renewalDate: '' };
  }

  cancelSubscription(id: number) {
    this.subscriptions = this.subscriptions.filter(sub => sub.id !== id);
    this.saveSubscriptions();
  }

  saveSubscriptions() {
    const all = this.dataService.getRawSubscriptions();
    const userEmail = this.userService.getUser()?.email;
    const updated = [
      ...all.filter(sub => sub.userEmail !== userEmail),
      ...this.subscriptions,
    ];
    this.dataService.setSubscriptions(updated);
  }

  getTotalCost(): number {
    return this.subscriptions.reduce((sum, sub) => sum + sub.price, 0);
  }
}
