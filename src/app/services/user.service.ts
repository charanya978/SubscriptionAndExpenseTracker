import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private isBrowser: boolean;
  private userData: { name: string; email: string } | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const storedUser = localStorage.getItem('currentUser');
      this.userData = storedUser ? JSON.parse(storedUser) : null;
    }
  }

  setUser(name: string, email: string) {
    this.userData = { name, email };
    if (this.isBrowser) {
      localStorage.setItem('currentUser', JSON.stringify(this.userData));
    }
  }

  getUser() {
    // Refresh from localStorage in case of page reload
    if (this.isBrowser && !this.userData) {
      const storedUser = localStorage.getItem('currentUser');
      this.userData = storedUser ? JSON.parse(storedUser) : null;
    }
    return this.userData;
  }

  clearUser() {
    this.userData = null;
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
    }
  }


  /** Example static value (could be dynamic later) */
  getUserBalance(): number {
    return 120;
  }
}
