import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SliderService {
  // constructor() { }

  private slideClickSubject = new Subject<string>();
  slideClicked$ = this.slideClickSubject.asObservable();

  sendSlideMessage(title: string) {
    this.slideClickSubject.next(title);
  }
}
