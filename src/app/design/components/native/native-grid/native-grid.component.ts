import { Component, Input } from '@angular/core';
import { GridConfig } from './grid.config';

@Component({
  selector: "native-grid",
  templateUrl: './native-grid.component.html',
  styleUrls: ['./native-grid.component.css']
})
export class NativeGridComponent {
  @Input() config: GridConfig

}