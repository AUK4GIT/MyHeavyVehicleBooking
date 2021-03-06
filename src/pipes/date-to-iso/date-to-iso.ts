import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateToIso',
})
export class DateToIsoPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    // Split timestamp into [ Y, M, D, h, m, s ]
    // var t = value.split(/[- :]/);

    // Apply each element to the Date function
    // var d = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));
    return value;//d.toISOString();
  }
}

