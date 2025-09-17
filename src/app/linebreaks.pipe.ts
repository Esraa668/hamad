import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linebreaks',
  standalone: true
})
export class LinebreaksPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
