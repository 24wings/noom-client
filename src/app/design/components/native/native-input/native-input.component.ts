import { Component, Input } from '@angular/core';
import { UIComponent } from '../../ui.component';
import { InputConfig, InputUIConfig, inputUIConfig } from './input.config';

@Component({ selector: 'native-input', templateUrl: './native-input.component.html' })
export class NativeInputComponent implements UIComponent {
  @Input() config: InputUIConfig;

}
