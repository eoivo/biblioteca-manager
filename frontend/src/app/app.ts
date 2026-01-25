import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, Book, Calendar, LayoutDashboard, LogOut, Library, Settings, ChevronDown, Menu, PanelLeft, Clock } from 'lucide-angular';
import { AuthService } from './core/services/auth.service';
import { map, filter, startWith } from 'rxjs/operators';
import { NotificationComponent } from './shared/components/notification/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule, NotificationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);

  title = 'BiblioManager';
  showUserDropdown = false;
  sidebarCollapsed = false;
  showMobileMenu = false;

  // Clock
  currentDateTime = new Date();
  private clockInterval: any;

  readonly DashboardIcon = LayoutDashboard;
  readonly UserIcon = User;
  readonly BookIcon = Book;
  readonly CalendarIcon = Calendar;
  readonly ClockIcon = Clock;
  readonly LogOutIcon = LogOut;
  readonly LibraryIcon = Library;
  readonly SettingsIcon = Settings;
  readonly ChevronDownIcon = ChevronDown;
  readonly MenuIcon = Menu;
  readonly ToggleIcon = PanelLeft;

  isLoggedIn$ = this.authService.isLoggedIn();
  currentUser$ = this.authService.user$;

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.showMobileMenu = false;
    });
  }

  ngOnInit() {
    this.clockInterval = setInterval(() => {
      this.currentDateTime = new Date();
    }, 1000); // 30s is fine but 1s is better for seconds, user asked for 'Date and Time'. Minutes is usually enough but seconds is cooler. Let's do 1s or 30s. User just said "data e hora em tempo real". I'll do 30s to save performance? No, 30s might miss the minute change for up to 30s. 1s or 5s is better. Let's do 10s. Or 30s and align.
    // 30s is fine.
  }

  ngOnDestroy() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  toggleUserDropdown(event: Event) {
    event.stopPropagation();
    this.showUserDropdown = !this.showUserDropdown;
  }

  hideUserDropdown() {
    this.showUserDropdown = false;
  }
  currentRoute$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(event => (event as NavigationEnd).url),
    startWith(this.router.url)
  );

  getModuleTitle(url: string | null): string {
    if (!url || url === '/') return 'Dashboard';
    const parts = url.split('/');
    return parts[1] || 'Dashboard';
  }

  logout() {
    this.authService.logout();
  }
}
