import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../header.component/header.component';
import { HomeStatsComponent } from '../home-stats.component/home-stats.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, HomeStatsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.setFooterVisible(true);
  }
}
