import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, Book, Calendar, LayoutDashboard, LogOut, Bell, Library } from 'lucide-angular';
import { AuthService } from './core/services/auth.service';
import { map, filter, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private authService = inject(AuthService);
  private router = inject(Router);

  title = 'BiblioFlow';

  readonly DashboardIcon = LayoutDashboard;
  readonly UserIcon = User;
  readonly BookIcon = Book;
  readonly CalendarIcon = Calendar;
  readonly LogOutIcon = LogOut;
  readonly BellIcon = Bell;
  readonly LibraryIcon = Library;

  isLoggedIn$ = this.authService.isLoggedIn();
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
