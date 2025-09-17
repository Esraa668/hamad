import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

interface SlideItem {
  icon: string;
  title: string;
}

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class SliderComponent implements AfterViewInit {
  @ViewChild('track', { static: false }) track!: ElementRef;

  rawItems: SlideItem[] = [
    { icon: '../../assets/Vector (1).png', title: 'Need a Website?' },
    { icon: '../../assets/Vector.png', title: 'What is SEO?' },
    { icon: '../../assets/Vector (6).png', title: 'AI Benefits' },
    { icon: '../../assets/Vector (3).png', title: 'Digital Transformation' },
    { icon: '../../assets/Vector (4).png', title: 'Digital Marketing' },
    { icon: '../../assets/Vector (5).png', title: 'Chat Bot' },
  ];

  items: SlideItem[] = [];
  index = 0;
  cardWidth = 200;
  transitioning = false;

  ngAfterViewInit() {
    this.setupInfiniteLoop();
  }

  setupInfiniteLoop() {
    const clonesBefore = this.rawItems.slice(-3);
    const clonesAfter = this.rawItems.slice(0, 3);
    this.items = [...clonesBefore, ...this.rawItems, ...clonesAfter];

    this.index = 3; // Start at the "real" first slide
    setTimeout(() => this.updateTransform(false));
  }

  updateTransform(smooth = true) {
    const trackEl = this.track.nativeElement as HTMLElement;
    trackEl.style.transition = smooth ? 'transform 0.5s ease' : 'none';
    trackEl.style.transform = `translateX(-${this.index * this.cardWidth}px)`;
  }

  nextSlide() {
    if (this.transitioning) return;
    this.index++;
    this.transitioning = true;
    this.updateTransform();

    this.resetIfCloned();
  }

  prevSlide() {
    if (this.transitioning) return;
    this.index--;
    this.transitioning = true;
    this.updateTransform();

    this.resetIfCloned();
  }

  resetIfCloned() {
    const trackEl = this.track.nativeElement as HTMLElement;
    trackEl.addEventListener(
      'transitionend',
      () => {
        this.transitioning = false;
        if (this.index >= this.items.length - 3) {
          this.index = 3;
          this.updateTransform(false);
        } else if (this.index < 3) {
          this.index = this.rawItems.length + 2;
          this.updateTransform(false);
        }
      },
      { once: true }
    );
  }
}
