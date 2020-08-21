import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import * as ngCommon from '@angular/common';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { AbpModule } from 'abp-ng2-module/dist/src/abp.module';
import { SharedModule } from '../app/shared/shared.module';
import { CommonModule } from '../shared/common/common.module';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { AccountRouteGuard } from './auth/account-route-guard';
import { ConfirmEmailComponent } from './email-activation/confirm-email.component';
import { EmailActivationComponent } from './email-activation/email-activation.component';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login/login.service';
import { ForgotPasswordComponent } from './password/forgot-password.component';
import { ResetPasswordComponent } from './password/reset-password.component';
import { RegisterTenantResultComponent } from './register/register-tenant-result.component';
import { RegisterTenantComponent } from './register/register-tenant.component';
import { RegisterComponent } from './register/register.component';
import { SelectEditionComponent } from './register/select-edition.component';
// import { RegisterComponent } from './register-old/register.component';
import { TenantChangeModalComponent } from './tenant/tenant-change-modal.component';
import { TenantChangeComponent } from './tenant/tenant-change.component';
@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    ngCommon.CommonModule, AccountRoutingModule, AppCommonModule, SharedModule, UtilsModule, ServiceProxyModule
  ],
  declarations: [
    AccountComponent,
    TenantChangeComponent,
    TenantChangeModalComponent,
    LoginComponent,
    // RegisterComponent,
    EmailActivationComponent,
    ConfirmEmailComponent,
    RegisterComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    SelectEditionComponent,
    RegisterTenantComponent,
    RegisterTenantResultComponent
  ],

  entryComponents: [],
  providers: [LoginService, AccountRouteGuard],
})
export class AccountModule { }
