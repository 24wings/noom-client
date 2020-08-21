// import { Directive, EventEmitter, Input, OnChanges, OnDestroy, Output, Self, SimpleChanges } from "@angular/core";
// import compare from "just-compare";
// import * as moment from "moment";
// import { BsDaterangepickerDirective } from "ngx-bootstrap/datepicker";
// import { Subscription } from "rxjs";
// import { filter } from "rxjs/operators";

// // this directive ensures that date values will always be the moment.
// @Directive({
//   selector: "[dateRangePickerMomentModifier]"
// })
// export class DateRangePickerMomentModifierDirective implements OnDestroy, OnChanges {
//   @Input() date = [moment(), moment()];
//   @Output() dateChange = new EventEmitter<moment.Moment[]>();

//   subscribe: Subscription;
//   lastDates: Date[] = null;

//   constructor(@Self() private bsDateRangepicker: BsDaterangepickerDirective) {
//     this.subscribe = bsDateRangepicker.bsValueChange
//       .pipe(
//         filter(
//           dates =>
//             !!(
//               dates &&
//               dates[0] instanceof Date &&
//               dates[1] instanceof Date &&
//               !compare(this.lastDates, dates) &&
//               dates[0].toString() !== "Invalid Date" &&
//               dates[1].toString() !== "Invalid Date"
//             )
//         )
//       )
//       .subscribe((dates: Date[]) => {
//         this.lastDates = dates;
//         this.dateChange.emit([moment(dates[0]), moment(dates[1])]);
//       });
//   }

//   ngOnDestroy() {
//     this.subscribe.unsubscribe();
//   }

//   ngOnChanges({ date }: SimpleChanges) {
//     if (date && date.currentValue && !compare(date.currentValue, date.previousValue)) {
//       setTimeout(() => (this.bsDateRangepicker.bsValue = [new Date(date.currentValue[0]), new Date(date.currentValue[1])]), 0);
//     }
//   }
// }
