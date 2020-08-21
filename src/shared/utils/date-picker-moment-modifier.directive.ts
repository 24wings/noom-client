// import { Directive, EventEmitter, Input, OnChanges, OnDestroy, Output, Self, SimpleChanges } from "@angular/core";
// import compare from "just-compare";
// import * as moment from "moment";
// import { BsDatepickerDirective } from "ngx-bootstrap/datepicker";
// import { Subscription } from "rxjs";
// import { filter } from "rxjs/operators";

// // this directive ensures that the date value will always be the moment.
// @Directive({
//   selector: "[datePickerMomentModifier]"
// })
// export class DatePickerMomentModifierDirective implements OnDestroy, OnChanges {
//   @Input() date = moment();
//   @Output() dateChange = new EventEmitter<moment.Moment>();

//   subscribe: Subscription;
//   lastDate: Date = null;

//   constructor(@Self() private bsDatepicker: BsDatepickerDirective) {
//     this.subscribe = bsDatepicker.bsValueChange.pipe(filter(date => date instanceof Date && !compare(this.lastDate, date) && !isNaN(date.getTime()))).subscribe((date: Date) => {
//       this.lastDate = date;
//       this.dateChange.emit(moment(date));
//     });
//   }

//   ngOnDestroy() {
//     this.subscribe.unsubscribe();
//   }

//   ngOnChanges({ date }: SimpleChanges) {
//     if (date && date.currentValue && !compare(date.currentValue, date.previousValue)) {
//       setTimeout(() => (this.bsDatepicker.bsValue = new Date(date.currentValue)), 0);
//     }
//   }
// }
