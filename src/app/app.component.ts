import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isAuthPage = false;
  isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // Check route on initial load
    this.setAuthPageClass(this.router.url);

    // Update on navigation events
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navEndEvent = event as NavigationEnd;
        this.setAuthPageClass(navEndEvent.urlAfterRedirects);
      });
  }

  private setAuthPageClass(url: string) {
    this.isAuthPage = url === '/login' || url === '/signup';

    // ✅ Safe access to document only if in browser
    if (this.isBrowser) {
      if (this.isAuthPage) {
        document.body.classList.add('auth-page');
      } else {
        document.body.classList.remove('auth-page');
      }
    }
  }
}
