import { LayoutModule as CDKLayoutModule } from '@angular/cdk/layout';
import { NgModule } from '@angular/core';

import { PRO_COMPONENTS, PRO_ENTRYCOMPONENTS } from './pro/index';

// passport
import * as ngCommon from '@angular/common';
import { SharedModule } from '..';
import { CommonModule } from '../../../shared/common/common.module';
import { UtilsModule } from '../../../shared/utils/utils.module';
import { AppCommonModule } from '../common/app-common.module';
import { LinkAccountModalComponent } from './link-account-modal.component';
import { LinkedAccountService } from './linked-account.service';
import { LinkedAccountsModalComponent } from './linked-accounts-modal.component';
import { LoginAttemptsModalComponent } from './login-attempts-modal.component';
import { LayoutPassportComponent } from './passport/passport.component';
const PASSPORT = [LayoutPassportComponent, LoginAttemptsModalComponent, LinkAccountModalComponent, LinkedAccountsModalComponent];

@NgModule({
  imports: [CommonModule, ngCommon.CommonModule, SharedModule, AppCommonModule, CDKLayoutModule, UtilsModule],
  entryComponents: PRO_ENTRYCOMPONENTS,
  declarations: [...PRO_COMPONENTS, ...PASSPORT],
  exports: [...PRO_COMPONENTS, ...PASSPORT],
  providers: [LinkedAccountService]
})
export class LayoutModule { }
