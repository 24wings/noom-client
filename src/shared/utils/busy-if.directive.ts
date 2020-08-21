// import { ComponentFactoryResolver, Directive, Injector, Input, OnChanges, SimpleChanges, ViewContainerRef } from "@angular/core";
// import { NgxSpinnerComponent, NgxSpinnerService } from "ngx-spinner";

// @Directive({
//   selector: "[busyIf]"
// })
// export class BusyIfDirective implements OnChanges {
//   private static index = 0;
//   @Input() busyIf: boolean;
//   ngxSpinnerService: NgxSpinnerService;
//   isBusy = false;
//   private spinnerName = "";

//   constructor(private _viewContainer: ViewContainerRef, private _componentFactoryResolver: ComponentFactoryResolver, private _injector: Injector) {
//     this.ngxSpinnerService = _injector.get(NgxSpinnerService);
//     this.loadComponent();
//   }

//   refreshState(): void {
//     if (this.isBusy === undefined || this.spinnerName === "") {
//       return;
//     }

//     setTimeout(() => {
//       if (this.isBusy) {
//         this.ngxSpinnerService.show(this.spinnerName);
//       } else {
//         this.ngxSpinnerService.hide(this.spinnerName);
//       }
//     }, 1000);
//   }

//   loadComponent() {
//     const componentFactory = this._componentFactoryResolver.resolveComponentFactory(NgxSpinnerComponent);
//     const componentRef = this._viewContainer.createComponent(componentFactory);
//     this.spinnerName = "busyIfSpinner-" + BusyIfDirective.index++ + "-" + Math.floor(Math.random() * 1000000); // generate random name
//     const component = componentRef.instance as NgxSpinnerComponent;
//     component.name = this.spinnerName;
//     component.fullScreen = false;

//     component.type = "ball-clip-rotate";
//     component.size = "medium";
//     component.color = "#5ba7ea";
//   }

//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes.busyIf) {
//       this.isBusy = changes.busyIf.currentValue;
//       this.refreshState();
//     }
//   }
// }
