import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { catchError, Observable, of, Subject, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  private socket: WebSocket | null = null;
  private messagesSubject = new Subject<string>();
  Date: any = '';
  userInfo: any;
  userid: any;
  baseUrl: string = environment.apiUrl;
  authenticationUrl: string = `${environment.apiUrl}/authentication/`;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // register(userData: object): Observable<any> {
  //   return this.http.post(this.baseUrl + 'registration/', userData);
  // }
  refreshToken(): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(null);
    }

    const refreshToken = localStorage.getItem('refresh');
    console.log(refreshToken);

    if (!refreshToken) {
      return of(null); // Silently fail if no refresh token
    }

    return this.http
      .post(this.authenticationUrl + 'token/refresh/', {
        refresh: refreshToken,
      })
      .pipe(
        tap((response: any) => {
          if (response && response.access) {
            localStorage.setItem('token', response.access);

            if (response.refresh) {
              localStorage.setItem('refresh', response.refresh);
            }

            this.decodeDate();
          }
        }),
        catchError((error) => {
          // Silently continue on error
          console.error('Token refresh failed', error);
          return of(null);
        })
      );
  }
  register(userData: object): Observable<any> {
    return this.http.post(this.authenticationUrl + 'registration/', userData);
  }

  login(loginDate: object): Observable<any> {
    return this.http.post(this.authenticationUrl + 'login/', loginDate);
  }

  decodeDate(): void {
    if (isPlatformBrowser(this.platformId)) {
      const encode = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');
      if (encode) {
        this.userInfo = jwtDecode(encode);
      }
      if (userId) {
        this.userid = userId;
        console.log('id', this.userid);
      }
    }
  }

  createNewChat(): Observable<any> {
    let token;
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token');
    }
    if (!token) {
      console.error('❌ No token found! Cannot create chat.');
      return new Observable((observer) => {
        observer.error('No token available.');
      });
    }

    const headers = new HttpHeaders({
      Authorization: `JWT ${token}`,
    });

    // https://api.ariflawfirm.com/api/chat/rooms
    return this.http.post(this.baseUrl + '/chat/rooms/', {}, { headers });
  }

  //

  connectToWebSocket() {
    let token;
    let id;
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token');
      id = localStorage.getItem('chatId');

      console.log('id_chat', id);
    }
    if (!token || !id) {
      console.error('❌ No token or chat ID found!');
      return;
    }

    const wsUrl = `wss://api.ariflawfirm.com/ws/chat/${id}/?authorization=JWT ${token}`;
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => console.log('✅ WebSocket connected');

    this.socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.message?.user == null) {
          this.messagesSubject.next(data.message.message);
          this.Date = data.message.date;
        } else {
          console.warn('⚠️ Unrecognized WebSocket message format:', data);
        }
      } catch (error) {
        console.error('❌ Error parsing WebSocket message:', error);
      }
    };

    this.socket.onerror = (error: any) =>
      console.error('🚨 WebSocket Error:', error);

    this.socket.onclose = (event) => {
      console.log('❌ WebSocket disconnected', event.reason);
      setTimeout(() => this.connectToWebSocket(), 5000); // Reconnect after 5s
    };
  }

  sendMessage(userMessage: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ message: userMessage }));
    } else {
      console.error('❌ WebSocket is not open. Cannot send message.');
    }
  }

  getMessages(): Observable<string> {
    return this.messagesSubject.asObservable();
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      console.log('WebSocket manually disconnected');
    }
  }
}
