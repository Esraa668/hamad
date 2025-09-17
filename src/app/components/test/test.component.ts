// import { SliderService } from './../../slider.service';
// import { cards } from './../../cards';
// import {
//   AfterViewInit,
//   Component,
//   CUSTOM_ELEMENTS_SCHEMA,
//   ViewEncapsulation,
// } from '@angular/core';
// import { register } from 'swiper/element/bundle';
// import { custom } from '../test/custom';
// import { ElementRef, ViewChild } from '@angular/core';
// import { CommonModule } from '@angular/common';
// // import { SliderService } from '../../slider.service';
// // import {  cards } from '../../cards';
// // import { cards } from '../../cards';

// register();
// declare var Swiper: any; // 👈 tells TypeScript Swiper will come from CDN

// @Component({
//   selector: 'app-test',
//   standalone: true,
//   templateUrl: './test.component.html',
//   styleUrls: ['./test.component.scss'],
//   encapsulation: ViewEncapsulation.None,

//   imports: [CommonModule],
//   //   Swiper not working on Server Component and we are using SSR in our project so we have to skip angular hydration to make swiper work as expected
//   host: {
//     ngSkipHydration: 'true', // ⛔ Skip SSR and hydration for this component
//   },
//   //   let Angular knows that we are using a custom library
//   schemas: [CUSTOM_ELEMENTS_SCHEMA],
// })
// export class TestComponent {
//   constructor(private SliderService: SliderService) {}
//   // ngAfterViewInit() {
//   //   const style = document.createElement('style');
//   //   style.textContent = custom;
//   //   document.head.appendChild(style);
//   // }
//   // getting the swiper ref to make the navigation buttons trigger the swiper element
//   @ViewChild('swiper') swiper!: ElementRef;
//   //   isBeginning and isEnd are flags to check if we are in the first card or last card to disable button on each state
//   isBeginning = true;
//   isEnd = false;

//   breakpoints = {
//     0: {
//       slidesPerView: 1,
//       spaceBetween: 5,
//       navigation: false,
//     },
//     540: {
//       slidesPerView: 2,
//       spaceBetween: 1,
//     },

//     // 600: {
//     //   slidesPerView: 2,
//     //   spaceBetween: 4,
//     // },

//     991: {
//       slidesPerView: 3,
//       spaceBetween: 3,
//     },
//     1199: {
//       slidesPerView: 3,
//       spaceBetween: 1,
//     },

//     1150: {
//       slidesPerView: 3,
//       spaceBetween: 3,
//     },

//     1499: {
//       slidesPerView: 4,
//       spaceBetween: 1,
//     },
//   };

//   cards = cards;

//   // NOTE**** :    USE (this.swiper.nativeElement.swiper) to get the ref of the swiper

//   //   sliderSwiper is a fucntion to trigger the slidePrev() and slideNext() function from Swiper and make the custom navigation buttons work
//   // It navigates depend ot the direction "prev", "next"
//   slideSwiper(direction: string): void {
//     if (direction === 'prev') {
//       this.swiper.nativeElement.swiper.slidePrev(); // Swiper method to slider to the previous slide
//       this.isBeginning = this.swiper.nativeElement.swiper.isBeginning ?? false; // swiper return an object has "isBeginning" and "isEnd" so we get them and assign it to our variables
//       this.isEnd = this.swiper.nativeElement.swiper.isEnd ?? false;
//     } else {
//       this.swiper.nativeElement.swiper.slideNext(); // Swiper method to slider to the next slide
//       this.isEnd = this.swiper.nativeElement.swiper.isEnd ?? false;
//       this.isBeginning = this.swiper.nativeElement.swiper.isBeginning ?? false;
//     }
//   }

//   slides = [
//     { text: 'Digital Transformation', icon: '../../../assets/Vector01.png' },
//     { text: 'Chat Bot', icon: '../../../assets/Vector04.png' },
//     { text: 'What is SEO?', icon: '../../../assets/fi_1659016.png' },
//     { text: 'Digital Marketing', icon: '../../../assets/vector03.png' },
//     { text: 'Need a Website?', icon: '../../../assets/vector_world.png' },
//     { text: 'Ai Benefits', icon: '../../../assets/fi_16806676.png' },
//   ];
//   //

//   onSlideClick(text: string) {
//     this.SliderService.sendSlideMessage(text);
//   }
// }

import { cards } from './../../cards';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewEncapsulation,
  ElementRef,
  ViewChild,
  OnInit,
} from '@angular/core';
import { register } from 'swiper/element/bundle';
import { CommonModule } from '@angular/common';
import { SliderService } from './../../slider.service';
import { TranslateService } from '@ngx-translate/core';

register();

@Component({
  selector: 'app-test',
  standalone: true,
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule],
  host: {
    ngSkipHydration: 'true',
  },
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TestComponent implements OnInit {
  constructor(
    private SliderService: SliderService,
    private translate: TranslateService
  ) {}

  @ViewChild('swiper') swiper!: ElementRef;

  isBeginning = true;
  isEnd = false;
  isRTL = false;

  breakpoints = {
    0: { slidesPerView: 1, spaceBetween: 1 },
    540: { slidesPerView: 2, spaceBetween: 1, navigation: false },
    991: { slidesPerView: 3, spaceBetween: 3 },
    1150: { slidesPerView: 3, spaceBetween: 3 },
    1199: { slidesPerView: 3, spaceBetween: 1 },
    1499: { slidesPerView: 4, spaceBetween: 1 },
  };

  slides: any[] = [];

  slidesEn = [
    { text: 'Cars Webpage', icon: '../../../assets/Vector (4).png' },
    { text: 'Work Time', icon: '../../../assets/Vector (3).png' },
    { text: 'Car Price', icon: '../../../assets/Vector (2).png' },
    { text: 'Sell Your Car', icon: '../../../assets/Vector (7).png' },
    { text: 'Search About Car', icon: '../../../assets/Vector (6).png' },
    { text: 'Cars Gallery', icon: '../../../assets/Vector (4).png' },
  ];

  slidesAr = [
    { text: 'موقع السيارات', icon: '../../../assets/Vector (4).png' },
    { text: 'مواعيد العمل', icon: '../../../assets/Vector (3).png' },
    { text: 'سعر السيارة', icon: '../../../assets/Vector (2).png' },
    { text: 'بيع سيارتك', icon: '../../../assets/Vector (7).png' },
    { text: 'ابحث عن سيارة', icon: '../../../assets/Vector (6).png' },
    { text: 'معرض السيارات', icon: '../../../assets/Vector (4).png' },
  ];

  ngOnInit(): void {
    this.setSlidesByLang(this.translate.currentLang);
    this.translate.onLangChange.subscribe((event) => {
      this.setSlidesByLang(event.lang);
    });
    this.setSlidesByLang(this.translate.currentLang);
  }

  swiperVisible = true;
  setSlidesByLang(lang: string): void {
    this.slides = lang === 'ar' ? this.slidesAr : this.slidesEn;
    this.isRTL = lang === 'ar';
    this.swiperVisible = false;
    setTimeout(() => {
      this.swiperVisible = true;
    });
  }

  slideSwiper(direction: string): void {
    if (direction === 'prev') {
      this.swiper.nativeElement.swiper.slidePrev();
      this.isBeginning = this.swiper.nativeElement.swiper.isBeginning ?? false;
      this.isEnd = this.swiper.nativeElement.swiper.isEnd ?? false;
    } else {
      this.swiper.nativeElement.swiper.slideNext();
      this.isEnd = this.swiper.nativeElement.swiper.isEnd ?? false;
      this.isBeginning = this.swiper.nativeElement.swiper.isBeginning ?? false;
    }
  }

  onSlideClick(text: string) {
    this.SliderService.sendSlideMessage(text);
  }
}
