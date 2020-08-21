import { AbpModule } from '@abp/abp.module';
import * as ngCommon from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { STModule } from '@delon/abc';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
// import { AppUiCustomizationService } from './ui/app-ui-customization.service';
import { CommonLookupModalComponent } from './lookup/common-lookup-modal.component';
import { AppUrlService } from './nav/app-url.service';
import { AppSessionService } from './session/app-session.service';
import { CookieConsentService } from './session/cookie-consent.service';
const COMPONENTS = [CommonLookupModalComponent];
@NgModule({
  imports: [ngCommon.CommonModule, AbpModule, FormsModule, NzModalModule, NzInputModule, NzButtonModule, STModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS]
})
export class CommonModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CommonModule,
      providers: [
        // AppUiCustomizationService,
        CookieConsentService,
        AppSessionService,
        AppUrlService,
      ],
    };
  }
}
