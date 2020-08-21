import { PlatformLocation } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import zh from '@angular/common/locales/zh';
import { APP_INITIALIZER, Injector, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppModule } from '@app/app.module';
import { AppConsts, SharedModule } from '@app/shared';
import { CommonModule } from '@shared/common/common.module';
import { AbpModule } from 'abp-ng2-module/dist/src/abp.module';
import { MessageService } from 'abp-ng2-module/dist/src/message/message.service';
import { AppPreBootstrap } from 'AppPreBootstrap';
import { NzIconService } from 'ng-zorro-antd';
import { RootRoutingModule } from 'root-routing.module';
import { RootComponent } from 'root.component';
import { AppSessionService } from 'shared/common/session/app-session.service';
import { UrlHelper } from 'shared/helpers/UrlHelper';
import { API_BASE_URL } from 'shared/service-proxies/service-proxies';
import { ServiceProxyModule } from 'shared/service-proxies/service-proxy.module';
import { ICONS } from 'style-icons';
import { ICONS_AUTO } from 'style-icons-auto';

// #region default language
// 参考：https://ng-alain.com/docs/i18n
import { default as ngLang } from '@angular/common/locales/zh';
import { DELON_LOCALE, zh_CN as delonLang } from '@delon/theme';
import { zhCN as dateLang } from 'date-fns/locale';
import { NZ_DATE_LOCALE, NZ_I18N, zh_CN as zorroLang } from 'ng-zorro-antd/i18n';
const LANG = {
  abbr: 'zh',
  ng: ngLang,
  zorro: zorroLang,
  date: dateLang,
  delon: delonLang,
};
// register angular
import { registerLocaleData } from '@angular/common';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { GlobalConfigModule } from './app/shared/global-config.module';
import { LayoutModule } from './app/shared/layout/layout.module';
registerLocaleData(LANG.ng, LANG.abbr);
const LANG_PROVIDES = [
  { provide: LOCALE_ID, useValue: LANG.abbr },
  { provide: NZ_I18N, useValue: LANG.zorro },
  { provide: NZ_DATE_LOCALE, useValue: LANG.date },
  { provide: DELON_LOCALE, useValue: LANG.delon },
];
// #endregion

export function appInitializerFactory(injector: Injector, platformLocation: PlatformLocation) {
  // 导入图标
  const iconSrv = injector.get(NzIconService);
  iconSrv.addIcon(...ICONS_AUTO, ...ICONS);

  return () => {
    return new Promise<boolean>((resolve, reject) => {
      AppConsts.appBaseHref = getBaseHref(platformLocation);
      const appBaseUrl = getDocumentOrigin() + AppConsts.appBaseHref;

      AppPreBootstrap.run(injector, appBaseUrl).then((rtn) => {
        handleLogoutRequest(injector.get(AppAuthService));
        // initializeLocalForage();

        // if (UrlHelper.isInstallUrl(location.href)) {
        //   doConfigurationForInstallPage(injector);
        //   // noinspection JSIgnoredPromiseFromCall
        //   spinnerService.hide();
        //   resolve(true);
        // } else {
        const appSessionService: AppSessionService = injector.get(AppSessionService);
        appSessionService.init().then(
          (result) => {
            resolve(true);
          },
          (err) => {
            reject(err);
          },
        );
        // }
      });
    });
  };
}

export function getDocumentOrigin() {
  if (!document.location.origin) {
    return `${document.location.protocol}//${document.location.hostname}${document.location.port ? `:${document.location.port}` : ''}`;
  }

  return document.location.origin;
}

export function getBaseHref(platformLocation: PlatformLocation): string {
  const baseUrl = platformLocation.getBaseHrefFromDOM();
  if (baseUrl) {
    return baseUrl;
  }

  return '/';
}

export function getRemoteServiceBaseUrl(): string {
  return AppConsts.remoteServiceBaseUrl;
}

export function getCurrentLanguage(): string {
  return abp.localization.currentLanguage.name;
}

function handleLogoutRequest(authService: AppAuthService) {
  const currentUrl = UrlHelper.initialUrl;
  const returnUrl = UrlHelper.getReturnUrl();
  if (currentUrl.indexOf('account/logout') >= 0 && returnUrl) {
    authService.logout(true, returnUrl);
  }
}

@NgModule({
  declarations: [RootComponent],
  imports: [
    LayoutModule,
    BrowserModule,
    BrowserAnimationsModule,
    AbpModule,
    AppModule,
    CommonModule.forRoot(),
    GlobalConfigModule.forRoot(),
    SharedModule.forRoot(),
    HttpClientModule,
    ServiceProxyModule,
    RootRoutingModule,
  ],
  exports: [],
  providers: [
    ...LANG_PROVIDES,
    { provide: API_BASE_URL, useFactory: getRemoteServiceBaseUrl },
    { provide: APP_INITIALIZER, useFactory: appInitializerFactory, deps: [Injector, PlatformLocation], multi: true },
    { provide: LOCALE_ID, useFactory: getCurrentLanguage },
  ],
  bootstrap: [RootComponent],
})
export class RootModule { }
