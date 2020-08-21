import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { AccountRouteGuard } from './auth/account-route-guard';
import { EmailActivationComponent } from './email-activation/email-activation.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './password/forgot-password.component';
import { RegisterTenantResultComponent } from './register/register-tenant-result.component';
import { RegisterTenantComponent } from './register/register-tenant.component';
import { RegisterComponent } from './register/register.component';
import { SelectEditionComponent } from './register/select-edition.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      { path: '', redirectTo: 'login' },
      { path: 'login', component: LoginComponent, canActivate: [AccountRouteGuard], data: { title: '登录' } },
      { path: 'register', component: RegisterComponent, canActivate: [AccountRouteGuard] },
      // { path: "login", component: LoginComponent, canActivate: [AccountRouteGuard] },
      // { path: "register", component: RegisterComponent, canActivate: [AccountRouteGuard] },
      { path: 'register-tenant', component: RegisterTenantComponent, canActivate: [AccountRouteGuard] },
      { path: 'register-tenant-result', component: RegisterTenantResultComponent, canActivate: [AccountRouteGuard] },
      { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [AccountRouteGuard] },
      // { path: "reset-password", component: ResetPasswordComponent, canActivate: [AccountRouteGuard] },
      { path: 'email-activation', component: EmailActivationComponent, canActivate: [AccountRouteGuard] },
      // { path: "confirm-email", component: ConfirmEmailComponent, canActivate: [AccountRouteGuard] },
      // { path: "send-code", component: SendTwoFactorCodeComponent, canActivate: [AccountRouteGuard] },
      // { path: "verify-code", component: ValidateTwoFactorCodeComponent, canActivate: [AccountRouteGuard] },

      // { path: "buy", component: BuyEditionComponent },
      // { path: "extend", component: ExtendEditionComponent },
      // { path: "upgrade", component: UpgradeEditionComponent },
      { path: 'select-edition', component: SelectEditionComponent },
      // { path: "paypal-purchase", component: PayPalPurchaseComponent },
      // { path: "stripe-purchase", component: StripePurchaseComponent },
      // { path: "stripe-payment-result", component: StripePaymentResultComponent },
      // { path: "stripe-cancel-payment", component: StripeCancelPaymentComponent },
      // { path: "payment-completed", component: PaymentCompletedComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule { }
