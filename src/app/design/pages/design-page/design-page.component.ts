import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit } from '@angular/core';
import { Control, InputControl } from '@app/design/meta/control';
import { ActionLogService } from '@app/design/services/action-log.service';
import { AppComponentBase } from '@shared/common/component-base';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'design-page',
  templateUrl: './design-page.component.html'
})
export class DesignPageComponent extends AppComponentBase implements OnInit {
  constructor(private injector: Injector, private actionLogService: ActionLogService, private nzMessage: NzMessageService, private httpClient: HttpClient) { super(injector); }
  controls: InputControl[] = [
    new InputControl(),
    new InputControl()
  ];
  defaultT: InputControl[] = [];
  async ngOnInit() {
    console.log('ddd');
    this.actionLogService.get().subscribe(rtn => this.nzMessage.info(rtn));
    const roles = await this.httpClient.get(`/role`).toPromise();
    console.log(roles);
  }
  log() {
    // console.log(this.defaultT)
  }

}
