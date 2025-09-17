import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ChatsService } from '../../chats.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserDATAService } from '../../user-data.service';
import { LangService } from '../../lang.service';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  err: string = '';
  load: boolean = false;
  currentLang = 'en';

  registerGroup: FormGroup = new FormGroup({
    first_name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('+973', [
      Validators.required,
      Validators.pattern(/^\+973[367]\d{7}$/),
    ]),
  });
  isRTL: boolean = false;
  selectedLanguage: string = 'en';

  constructor(
    private _ChatsService: ChatsService,
    private _Router: Router,
    private translate: TranslateService,
    private _langService: LangService,
    private _UserDATAService: UserDATAService,

    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.translate.addLangs(['en', 'ar']);
    this.translate.setDefaultLang('en');
    if (isPlatformBrowser(this.platformId)) {
      let langToUse = 'en'; // Force English as default

      const savedLang = localStorage.getItem('lang');
      if (savedLang === 'ar' || savedLang === 'en') {
        langToUse = savedLang;
      }

      this.translate.use(langToUse);
      this.currentLang = langToUse as 'en' | 'ar';
      this.isRTL = langToUse === 'ar';

      document.documentElement.dir = this.isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = langToUse;
    }
  }

  handle(): void {
    this.load = true;
    const userData = this.registerGroup.value;
    if (this.registerGroup.valid) {
      this._ChatsService.register(userData).subscribe({
        next: (response) => {
          this._UserDATAService.setUsername(response.user.first_name);

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
                  console.log(chatRes.id);
                }
                this._ChatsService.connectToWebSocket();
              },
              error: (chatErr) => {
                console.error('Failed to create new chat:', chatErr);
                this.load = false;
              },
            });
          });
        },
        error: (err) => {
          console.error('Registration failed:', err);
          this.load = false;
        },
      });
    }
  }

  enforcePrefix(event: KeyboardEvent): void {
    const control = this.registerGroup.get('phone');
    const value = control?.value || '';
    if (
      (event.key === 'Backspace' || event.key === 'Delete') &&
      value.length <= 4
    ) {
      event.preventDefault();
    }

    const input = event.target as HTMLInputElement;
    if (input.selectionStart && input.selectionStart < 4) {
      event.preventDefault();
      setTimeout(() => {
        input.setSelectionRange(value.length, value.length);
      });
    }
  }

  switchLanguage(lang: string) {
    this._langService.lang.next(lang);
    if (lang) {
      this.translate.use(lang);
      this.isRTL = lang === 'ar';

      if (isPlatformBrowser(this.platformId)) {
        document.documentElement.dir = this.isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        localStorage.setItem('lang', lang);
      }
    }
    this.load = false;
  }
}
