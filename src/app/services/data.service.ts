import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  private isBrowser: boolean;
  private expensesSubject = new BehaviorSubject<any[]>([]);
  private subscriptionsSubject = new BehaviorSubject<any[]>([]);

  expenses$ = this.expensesSubject.asObservable();
  subscriptions$ = this.subscriptionsSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      const email = this.getCurrentUserEmail();
      if (email) {
        this.expensesSubject.next(this.load(`expenses_${email}`));
        this.subscriptionsSubject.next(this.load(`subscriptions_${email}`));
      }
    }
  }

  private getCurrentUserEmail(): string | null {
    if (!this.isBrowser) return null;
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user).email : null;
  }

  private load(key: string): any[] {
    return this.isBrowser ? JSON.parse(localStorage.getItem(key) || '[]') : [];
  }

  private save(key: string, data: any[]) {
    if (this.isBrowser) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  setExpenses(expenses: any[]) {
    const email = this.getCurrentUserEmail();
    if (email) {
      this.save(`expenses_${email}`, expenses);
      this.expensesSubject.next(expenses);
    }
  }

  setSubscriptions(subs: any[]) {
    const email = this.getCurrentUserEmail();
    if (email) {
      this.save(`subscriptions_${email}`, subs);
      this.subscriptionsSubject.next(subs);
    }
  }

  getRawExpenses(): any[] {
    return this.expensesSubject.getValue();
  }

  getRawSubscriptions(): any[] {
    return this.subscriptionsSubject.getValue();
  }
}
