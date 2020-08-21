import { Component, Input } from '@angular/core';
import { InputConfig, InputUIConfig, inputUIConfig } from './input.config';
import { UIComponent } from '../../ui.component';

@Component({ selector: "native-input", templateUrl: './native-input.component.html' })
export class NativeInputComponent implements UIComponent {
  @Input() config: InputUIConfig;

}