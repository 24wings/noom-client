import { AbpSessionService } from '@abp/session/abp-session.service';
import { ResourceLoader } from '@angular/compiler';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
// import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/component-base/app-component-base';
import { SessionServiceProxy, UpdateUserSignInTokenOutput } from '@shared/service-proxies/service-proxies';
// import { RecaptchaComponent } from 'ng-recaptcha';
import { UrlHelper } from 'shared/helpers/UrlHelper';
import { ExternalLoginProvider, LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent extends AppComponentBase implements OnInit {
  submitting = false;
  error = '';
  isMultiTenancyEnabled: boolean = this.multiTenancy.isEnabled;
  recaptchaSiteKey: string = AppConsts.recaptchaSiteKey;
  captchaResponse?: string;

  constructor(
    injector: Injector,
    public loginService: LoginService,
    private _router: Router,
    private _sessionService: AbpSessionService,
    private _sessionAppService: SessionServiceProxy,
  ) {
    super(injector);
  }

  setLang(val) {
    abp.utils.setCookieValue('Abp.Localization.CultureName', val);
    location.reload();
  }
  get multiTenancySideIsTenant(): boolean {
    return this._sessionService.tenantId > 0;
  }

  get isTenantSelfRegistrationAllowed(): boolean {
    return this.setting.getBoolean('App.TenantManagement.AllowSelfRegistration');
  }

  get isSelfRegistrationAllowed(): boolean {
    if (!this._sessionService.tenantId) {
      return false;
    }

    return this.setting.getBoolean('App.UserManagement.AllowSelfRegistration');
  }

  get useCaptcha(): boolean {
    return this.setting.getBoolean('App.UserManagement.UseCaptchaOnLogin');
  }

  ngOnInit(): void {

    const resturnUrl = UrlHelper.getReturnUrl();
    const sign = UrlHelper.getSingleSignIn();
    if (this._sessionService.userId > 0 && UrlHelper.getReturnUrl() && UrlHelper.getSingleSignIn()) {
      this._sessionAppService.updateUserSignInToken().subscribe((result: UpdateUserSignInTokenOutput) => {
        const initialReturnUrl = UrlHelper.getReturnUrl();
        location.href =
          initialReturnUrl +
          (initialReturnUrl.indexOf('?') >= 0 ? '&' : '?') +
          'accessToken=' +
          result.signInToken +
          '&userId=' +
          result.encodedUserId +
          '&tenantId=' +
          result.encodedTenantId;
      });

    }

    // const state = UrlHelper.getQueryParametersUsingHash().state;
    // if (state && state.indexOf('openIdConnect') >= 0) {
    //   this.loginService.openIdConnectLoginCallback({});
    // }
  }

  login(): void {
    // if (this.useCaptcha && !this.captchaResponse) {
    //   this.message.warn(this.l('CaptchaCanNotBeEmpty'));
    //   return;
    // }

    // this.spinnerService.show();

    this.submitting = true;
    debugger;
    this.loginService.authenticate(
      () => {
        this.submitting = false;
        // this.spinnerService.hide();

        // if (this.recaptchaRef) {
        //   this.recaptchaRef.reset();
        // }
      },
      null,
      this.captchaResponse
    );
  }

  // externalLogin(provider: ExternalLoginProvider) {
  //   this.loginService.externalAuthenticate(provider);
  // }

  captchaResolved(captchaResponse: string): void {
    this.captchaResponse = captchaResponse;
  }
}
