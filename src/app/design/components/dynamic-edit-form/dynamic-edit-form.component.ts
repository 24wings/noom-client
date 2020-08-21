import { Component, Input } from '@angular/core';
import { StableEditFormMeta } from '@app/design/decorator/stable-edit-form-meta';

@Component({
  selector: 'app-dynamic-edit-form',
  templateUrl: './dynamic-edit-form.component.html'
})
export class DynamicEditFormComponent {
  active = true;
  @Input() config: StableEditFormMeta;


  shown(config: StableEditFormMeta) {
    this.config = config;
  }
}
