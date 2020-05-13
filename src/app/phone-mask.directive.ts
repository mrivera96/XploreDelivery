import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPhoneMask]'
})
export class PhoneMaskDirective {

  constructor(
    public ngControl: NgControl
  ) { }

  @HostListener('ngModelChange', ['$event'])
  onModelChange(event) {
    this.onInputChange(event, false);
  }

  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(event) {
    this.onInputChange(event.target.value, true);
  }


  onInputChange(event, backspace) {
    let newVal = event?.replace(/\D/g, '');
    /*if (backspace && newVal.length <= 6) {
      newVal = newVal.substring(0, newVal.length - 1);
    }*/
    if (newVal?.length === 0) {
      newVal = '';
    } else if (newVal.length > 4) {
      newVal = newVal.replace(/^(\d{0,4})(\d{0,4})/, '$1-$2');
    }
    this.ngControl.valueAccessor.writeValue(newVal);
  }

}
