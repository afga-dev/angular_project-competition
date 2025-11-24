import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './pages/navbar.component/navbar.component';
import { FooterComponent } from './pages/footer.component/footer.component';
import { UserService } from './core/services/user.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FooterComponent, NavbarComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  isLoaded = computed(() => this.userService.isLoaded());
  isPageLoaded = computed(() => this.authService.isFooterVisible());

  // Load user session on app startup
  ngOnInit(): void {
    this.userService.loadUserFromLocalStorage();
  }
}
