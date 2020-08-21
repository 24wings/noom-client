import { AbpModule } from '@abp/abp.module';
import * as ngCommon from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { UtilsModule } from '@shared/utils/utils.module';
import { SharedModule } from '../shared.module';
import { AppAuthService } from './auth/app-auth.service';
import { AppRouteGuard } from './auth/auth-route-guard';
import { EntityChangeDetailModalComponent } from './entityHistory/entity-change-detail-modal.component';
import { EntityTypeHistoryModalComponent } from './entityHistory/entity-type-history-modal.component';
import { AppLocalizationService } from './localization/app-localization.service';

const COMPONENTS = [EntityChangeDetailModalComponent, EntityTypeHistoryModalComponent];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [ngCommon.CommonModule, UtilsModule, SharedModule, AbpModule],
  exports: [ngCommon.CommonModule, ...COMPONENTS],
  providers: [AppLocalizationService],
})
export class AppCommonModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppCommonModule,
      providers: [AppAuthService, AppRouteGuard],
    };
  }
}
