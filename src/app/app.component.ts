import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ChatsService } from './chats.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'chat';
  constructor(private chatsService: ChatsService) {}

  ngOnInit() {
    // Refresh token only during page initialization
    this.chatsService.refreshToken().subscribe({
      next: () => console.log('✅ Token refreshed during initialization'),
      error: (err) => console.error('❌ Token refresh failed', err),
    });
  }
}
