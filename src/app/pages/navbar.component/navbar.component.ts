import { Component, computed, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { scrollToElement, scrollToTop } from '../../utils/scroll-utils';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private router = inject(Router);

  private authService = inject(AuthService);
  private userService = inject(UserService);

  user = computed(() => this.userService.user());

  onSignOut(): void {
    this.authService.signOutAndRedirect();
  }

  // Scroll helpers
  scrollToHome(): void {
    if (this.router.url === '/') {
      scrollToTop();
    } else {
      this.router.navigateByUrl('/');
    }
  }

  scrollToFooter(): void {
    scrollToElement('contact');
  }
}
