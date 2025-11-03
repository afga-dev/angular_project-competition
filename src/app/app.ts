import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';
import { NavbarComponent } from './pages/navbar.component/navbar.component';
import { FooterComponent } from './pages/footer.component/footer.component';

@Component({
  selector: 'app-root',
  imports: [FooterComponent, NavbarComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  userService = inject(UserService);
}
