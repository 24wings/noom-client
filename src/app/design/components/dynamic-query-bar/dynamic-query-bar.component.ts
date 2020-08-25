import { Component, Input } from '@angular/core';
import { StableQueryBar } from 'dto-ui-types';

@Component({ selector: 'dynamic-query-bar', templateUrl: './dynamic-query-bar.component.html' })
export class DynamicQueryBarComponent {
  @Input() config: StableQueryBar;

}
