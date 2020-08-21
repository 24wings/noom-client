import { Component, Output, EventEmitter } from '@angular/core';
import { UiProp, } from '@app/design/meta/ui.prop';

@Component({ selector: 'config-modal', templateUrl: './config-modal.component.html' })
export class ConfigModalComponent {
  active = false;
  uiProps: UiProp[] = []
  @Output() onSave = new EventEmitter();
  shown(uiProps: UiProp[]) {
    this.uiProps = uiProps;
    this.active = true;
  }

  save() {
    let value = {};
    this.uiProps.forEach(p => {
      value[p.field] = p.value
    })
    this.onSave.emit(value);
    this.active = false;
  }

}