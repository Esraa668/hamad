import { SliderService } from './../../slider.service';
import { TestComponent } from './../test/test.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';
import {
  Component,
  OnInit,
  PLATFORM_ID,
  Inject,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatsService } from '../../chats.service';
import { Router } from '@angular/router';
import { UserDATAService } from '../../user-data.service';
import { cards } from '../../cards';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
interface ChatMessage {
  text: string;
  sender: 'user' | 'ai';
  isLoading?: boolean;
  isTyping?: boolean;
}
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, TestComponent, TranslateModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @ViewChild('chatBox', { static: false }) chatBox!: ElementRef;

  showSlider = true;
  isBotTyping = false;
  userMessage = '';
  messages: ChatMessage[] = [];
  username = '';
  isRTL = false;
  typingInterval: any = null;
  currentLang = 'en';
  loader = false;

  constructor(
    public chatService: ChatsService,
    private _Router: Router,
    private _UserDATAService: UserDATAService,
    private slider: SliderService,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.translate.addLangs(['en', 'ar']);
    this.translate.setDefaultLang('en');
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem('lang');
      const browserLang = this.translate.getBrowserLang();
      const langToUse =
        savedLang || (browserLang?.match(/en|ar/) ? browserLang : 'en');

      this.translate.use(langToUse);
      this.currentLang = langToUse as 'en' | 'ar';
      this.isRTL = langToUse === 'ar';
      document.documentElement.dir = this.isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = langToUse;
    }
  }

  ngOnInit(): void {
    this.chatService.connectToWebSocket();
    this.username = this._UserDATAService.getUsername();

    this.chatService.getMessages().subscribe((message: any) => {
      this.showSlider = false;
      this.loader = false; // ✅ Hide loader when message arrives
      this.simulateTypingEffect(message);
    });

    this.slider.slideClicked$.subscribe((text) => {
      this.userMessage = text;
      this.sendMessage();
    });
  }

  // autoResize() {
  //   const textArea = this.chatBox.nativeElement;
  //   textArea.style.height = 'auto';
  //   textArea.style.height = textArea.scrollHeight + 'px';
  // }

  stopResponse(): void {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
      this.typingInterval = null;
    }

    this.isBotTyping = false;

    // Force finish last AI message
    const lastMsg = [...this.messages]
      .reverse()
      .find((m) => m.sender === 'ai' && (m.isTyping || m.isLoading));
    if (lastMsg) {
      lastMsg.isTyping = false;
      lastMsg.isLoading = false;
    }
  }

  clearChat(): void {
    const currentLang = this.translate.currentLang;
    const swalText =
      currentLang === 'ar'
        ? 'إذا كنت بحاجة إلى أي مساعدة إضافية، فقط ابدأ محادثة جديدة في أي وقت. إلى اللقاء واعتني بنفسك!'
        : 'If you need any further assistance, simply start a new chat with me at any time. Bye and take care!';

    const confirmButtonText =
      currentLang === 'ar' ? 'إنهاء المحادثة' : 'End This Chat';
    const cancelButtonText = currentLang === 'ar' ? 'إلغاء' : 'Cancel';

    Swal.fire({
      text: swalText,

      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      confirmButtonColor: 'black',
      cancelButtonColor: '#6c757d',
    }).then((result) => {
      if (result.isConfirmed) {
        this.messages = [];
        this.showSlider = true;
        this.userMessage = '';

        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('token');
          localStorage.removeItem('refresh');
          localStorage.removeItem('user_id');
          localStorage.removeItem('chatId');
          localStorage.removeItem('name');
        }

        this._Router.navigate(['auth/register']);
      }
    });
  }

  NewChat(): void {
    const currentLang = this.translate.currentLang;

    const swalText =
      currentLang === 'ar'
        ? 'هل أنت متأكد أنك تريد بدء محادثة جديدة؟'
        : 'Are you sure you want to start a new chat?';

    const confirmButtonText = currentLang === 'ar' ? 'تأكيد' : 'Confirm';

    const cancelButtonText = currentLang === 'ar' ? 'إلغاء' : 'Cancel';

    Swal.fire({
      text: swalText,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      showCancelButton: true,
      confirmButtonColor: '#232323',
      cancelButtonColor: '#6c757d',
    }).then((result) => {
      if (result.isConfirmed) {
        this.chatService.createNewChat().subscribe({
          next: (chatRes: any) => {
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('chatId', chatRes.id);
            }
            console.log(chatRes.id);
            this.messages = [];
            this.showSlider = true;

            this.chatService.connectToWebSocket();
            this.translate.use(this.translate.currentLang);
            this.isBotTyping = false;
          },

          error: (chatErr) => {
            console.error('Failed to create new chat:', chatErr);
          },
        });
      }
    });
  }

  disconnectChat(): void {
    this.chatService.disconnect();
  }
  switchLanguage(lang: string) {
    if (lang) {
      this.translate.use(lang);
      this.isRTL = lang === 'ar';

      if (isPlatformBrowser(this.platformId)) {
        document.documentElement.dir = this.isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        localStorage.setItem('lang', lang);
      }
    }
  }

  sendMessage(): void {
    this.showSlider = false;
    const trimmed = this.userMessage.trim();
    if (!trimmed || this.isBotTyping) return;
    this.messages.push({ text: trimmed, sender: 'user' });
    this.chatService.sendMessage(trimmed);
    this.messages.push({
      text: '',
      sender: 'ai',
      isLoading: true,
      isTyping: false,
    });
    this.userMessage = '';
    this.isBotTyping = true;
  }
  simulateTypingEffect(fullText: string): void {
    const lastAI = [...this.messages]
      .reverse()
      .find((m) => m.sender === 'ai' && m.isLoading);
    if (!lastAI) return;
    lastAI.isLoading = false;
    lastAI.isTyping = true;
    lastAI.text = '';
    let index = 0;
    const typingSpeed = 30;
    this.typingInterval = setInterval(() => {
      if (!this.isBotTyping) {
        clearInterval(this.typingInterval);
        lastAI.isTyping = false;
        return;
      }
      if (index < fullText.length) {
        lastAI.text += fullText[index++];
      } else {
        clearInterval(this.typingInterval);
        lastAI.isTyping = false;
        this.isBotTyping = false;
      }
    }, typingSpeed);
  }
}
