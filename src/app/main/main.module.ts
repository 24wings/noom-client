import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MainRoutingModule } from './main-routing.module';

import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, MainRoutingModule, UtilsModule, AppCommonModule],
  exports: [],
  providers: [],
})
export class MainModule { }
