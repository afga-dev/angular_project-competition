import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './pages/navbar.component/navbar.component';
import { FooterComponent } from './pages/footer.component/footer.component';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FooterComponent, NavbarComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private userService = inject(UserService);

  isLoaded = computed(() => this.userService.isLoaded());

  ngOnInit(): void {
    this.userService.loadUserFromLocalStorage();
  }
}
