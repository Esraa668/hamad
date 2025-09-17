import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ChatsService } from '../../chats.service';
import { UserDATAService } from '../../user-data.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private _ChatsService: ChatsService,
    private _Router: Router,
    private _UserDATAService: UserDATAService,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  err: string = '';
  load: boolean = false;

  loginGroup: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-z0-9_@]{6,}$/),
    ]),
  });

  ngOnInit(): void {
    this.loginGroup.valueChanges.subscribe(() => {
      this.err = ''; // Clear error message on input change
    });
  }

  handle(): void {
    this.load = true;
    const loginData = this.loginGroup.value;

    if (this.loginGroup.valid) {
      this._ChatsService.login(loginData).subscribe({
        next: (response) => {
          this._UserDATAService.setUsername(response.user.username);
          this.load = false;
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.access_token);
            localStorage.setItem('refresh', response.refresh_token);
            localStorage.setItem('user_id', response.user.pk);
          }
          this._ChatsService.decodeDate();
          this._Router.navigate(['blank/chat']).then(() => {
            this._ChatsService.createNewChat().subscribe({
              next: (chatRes: any) => {
                if (isPlatformBrowser(this.platformId)) {
                  localStorage.setItem('chatId', chatRes.id);
                }
                this._ChatsService.connectToWebSocket();
              },
              error: (chatErr) => {
                console.error('Failed to create new chat:', chatErr);
              },
            });
          });
        },
        error: (err) => {
          this.load = false;
          console.log(err);

          // this.err = err.error.message || 'Login failed. Please try again.';

          // Check for array-based error
          if (
            err.error?.non_field_errors &&
            Array.isArray(err.error.non_field_errors)
          ) {
            this.errLogin = this.err = err.error.non_field_errors[0]; // Show the first message
          } else {
            this.errLogin = this.err =
              err.error.message || 'Login failed. Please try again.';
          }
          console.error('Login failed:', this.err);
        },
      });
    }
  }

  errLogin: any;
  register(): void {
    this._Router.navigate(['auth/register']);
  }

  switchLanguage(lang: string): void {
    this.translate.use(lang);
  }

  get isRTL(): boolean {
    return this.translate.currentLang === 'ar';
  }
}
