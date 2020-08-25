import { Component, Input } from '@angular/core';

@Component({ selector: 'app-checkbox', templateUrl: './checkbox.component.html' })
export class CheckboxComponent {

  @Input() fieldItem: any;
  @Input() config;

}
