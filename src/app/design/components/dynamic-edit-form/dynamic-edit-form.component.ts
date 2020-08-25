import { Component, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StableEditFormMeta } from '@app/design/decorator/stable-edit-form-meta';
import { StableForm } from 'dto-ui-types';

@Component({
  selector: 'app-dynamic-edit-form',
  templateUrl: './dynamic-edit-form.component.html'
})
export class DynamicEditFormComponent {
  @ViewChild('editForm') editForm: FormGroup;
  active = true;
  @Input() config: StableForm;


  shown(config: StableForm) {
    this.config = config;
  }
  log(e, e2) {
    console.log(`log`, e, e2);
    this.config.formItems.forEach(item => {

    });
  }
}
