import { Component, Injector } from '@angular/core';
import { Control, InputControl } from '@app/design/meta/control';
import { ActionLogService } from '@app/design/services/action-log.service';
import { AppComponentBase } from '@shared/common/component-base';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'design-page',
  templateUrl: './design-page.component.html'
})
export class DesignPageComponent extends AppComponentBase {
  constructor(private injector: Injector, private actionLogService: ActionLogService, private nzMessage: NzMessageService) { super(injector); }
  controls: InputControl[] = [
    new InputControl(),
    new InputControl()
  ];
  defaultT: InputControl[] = [];
  ngOnInit() {
    console.log('ddd');
    this.actionLogService.get().subscribe(rtn => this.nzMessage.info(rtn));
  }
  log() {
    // console.log(this.defaultT)
  }

}
