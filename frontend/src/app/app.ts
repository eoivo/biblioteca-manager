import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, User, Book, Calendar, Home } from 'lucide-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'Sistema de Biblioteca';

  readonly HomeIcon = Home;
  readonly UserIcon = User;
  readonly BookIcon = Book;
  readonly CalendarIcon = Calendar;
}
