import {Directive, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild} from '@angular/core';
import {NgControl} from "@angular/forms";

@Directive({
  selector: '[appCardMask]'
})
export class CardMaskDirective {

  @Output()cardType: EventEmitter<string> = new EventEmitter<string>()
  type: string

  constructor(public ngControl: NgControl) {
  }

  @HostListener('ngModelChange', ['$event'])
  onModelChange(event) {
    this.onInputChange(event);
  }

  onInputChange(event) {
    let newVal = event?.replace(/\D/g, '');
    /*if (backspace && newVal.length <= 6) {
      newVal = newVal.substring(0, newVal.length - 1);
    }*/
    if (newVal?.length === 0) {
      newVal = '';
    } else if (newVal.length > 4) {
      newVal = newVal.replace(/^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/, '$1 $2 $3 $4');
    }

    this.ngControl.valueAccessor.writeValue(newVal);
    let cNumber = event.replace(/\D/g, '');
    let cType = cNumber.substr(0,2)


    if(cType.length == 2){
      cType=parseInt(cType);
      if(cType >= 40 && cType <= 49){
        this.type = 'Visa'
      }else if(cType >= 50 && cType <= 55){
        this.type = 'Master Card'
      }else{
        this.type=null
      }
      this.cardType.emit(this.type)
    }
  }

}
