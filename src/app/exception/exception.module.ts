import { NgModule } from '@angular/core';

import { ExceptionRoutingModule } from './exception-routing.module';

import * as ngCommon from '@angular/common';
import { ExceptionModule as ExcepModule } from '@delon/abc';
import { NzCardModule } from 'ng-zorro-antd/card';
import { Exception403Component } from './403.component';
import { Exception404Component } from './404.component';
import { Exception500Component } from './500.component';
import { ExceptionTriggerComponent } from './trigger.component';

const COMPONENTS = [Exception403Component, Exception404Component, Exception500Component, ExceptionTriggerComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [ExcepModule, ExceptionRoutingModule, NzCardModule, ngCommon.CommonModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class ExceptionModule { }
