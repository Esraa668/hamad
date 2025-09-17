import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LangService {
  constructor() {}

  lang: BehaviorSubject<any> = new BehaviorSubject('en');
}
