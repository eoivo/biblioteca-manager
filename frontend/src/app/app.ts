import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, Book, Calendar, LayoutDashboard, LogOut, Library, Settings, ChevronDown, Menu, PanelLeft } from 'lucide-angular';
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
export class App {
  private authService = inject(AuthService);
  private router = inject(Router);

  title = 'BiblioManager';
  showUserDropdown = false;
  sidebarCollapsed = false;
  showMobileMenu = false;

  readonly DashboardIcon = LayoutDashboard;
  readonly UserIcon = User;
  readonly BookIcon = Book;
  readonly CalendarIcon = Calendar;
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
