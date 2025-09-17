import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserDATAService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  private username: string = '';
  setUsername(name: string) {
    this.username = name;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('name', this.username);
    }
  }
  getUsername(): string {
    let storedName;
    if (isPlatformBrowser(this.platformId)) {
      storedName = localStorage.getItem('name');
      // console.log(storedName);
    }
    return storedName ? storedName : this.username;
  }
}
