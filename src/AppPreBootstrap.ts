import { UtilsService } from '@abp/utils/utils.service';
import { registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CompilerOptions, Injector, NgModuleRef, Type } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Menu, MenuService, SettingsService } from '@delon/theme';
import { environment } from 'environments/environment';
// import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
// import { DynamicResourcesHelper } from '@shared/helpers/DynamicResourcesHelper';
// import { SubdomainTenancyNameFinder } from '@shared/helpers/SubdomainTenancyNameFinder';
// import { UrlHelper } from '@shared/helpers/UrlHelper';
// import { XmlHttpRequestHelper } from '@shared/helpers/XmlHttpRequestHelper';
// import { LocaleMappingService } from '@shared/locale-mapping.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { AppConsts } from 'shared/AppConsts';
import { SubdomainTenancyNameFinder } from 'shared/helpers/SubdomainTenancyNameFinder';
import { UrlHelper } from 'shared/helpers/UrlHelper';
import { XmlHttpRequestHelper } from 'shared/helpers/XmlHttpRequestHelper';
import { AppMenus } from './shared/AppMenus';

export class AppPreBootstrap {
  static run(injector: Injector, appRootUrl: string): Promise<any> {
    return new Promise((resolve) => {
      AppPreBootstrap.getApplicationConfig(appRootUrl, () => {
        // if (UrlHelper.isInstallUrl(location.href)) {
        //   AppPreBootstrap.loadAssetsForInstallPage(callback);
        //   return;
        // }
        const queryStringObj = UrlHelper.getQueryParameters();

        if (queryStringObj.redirect && queryStringObj.redirect === 'TenantRegistration') {
          // if (queryStringObj.forceNewRegistration) {
          //   new AppAuthService().logout();
          // }

          location.href = `${AppConsts.appBaseUrl}/account/select-edition`;
        } else if (queryStringObj.impersonationToken) {
          AppPreBootstrap.impersonatedAuthenticate(queryStringObj.impersonationToken, queryStringObj.tenantId, () => {
            AppPreBootstrap.getUserConfiguration(injector, () => resolve(true));
          });
        } else if (queryStringObj.switchAccountToken) {
          AppPreBootstrap.linkedAccountAuthenticate(queryStringObj.switchAccountToken, queryStringObj.tenantId, () => {
            AppPreBootstrap.getUserConfiguration(injector, () => resolve(true));
          });
        } else {
          AppPreBootstrap.getUserConfiguration(injector, () => resolve(true));
        }
      });
    });
  }

  static bootstrap<TM>(moduleType: Type<TM>, compilerOptions?: CompilerOptions | CompilerOptions[]): Promise<NgModuleRef<TM>> {
    return platformBrowserDynamic().bootstrapModule(moduleType, compilerOptions);
  }

  private static getApplicationConfig(appRootUrl: string, callback: () => void) {
    const type = 'GET';
    const url = `${appRootUrl}assets/${environment.appConfig}`;
    const customHeaders = [
      {
        name: abp.multiTenancy.tenantIdCookieName,
        value: `${abp.multiTenancy.getTenantIdCookie()}`,
      },
    ];

    XmlHttpRequestHelper.ajax(type, url, customHeaders, null, (result) => {
      const subdomainTenancyNameFinder = new SubdomainTenancyNameFinder();
      const tenancyName = subdomainTenancyNameFinder.getCurrentTenancyNameOrNull(result.appBaseUrl);

      AppConsts.appBaseUrlFormat = result.appBaseUrl;
      AppConsts.remoteServiceBaseUrlFormat = result.remoteServiceBaseUrl;
      AppConsts.localeMappings = result.localeMappings;

      if (tenancyName == null) {
        AppConsts.appBaseUrl = result.appBaseUrl.replace(`${AppConsts.tenancyNamePlaceHolderInUrl}.`, '');
        AppConsts.remoteServiceBaseUrl = result.remoteServiceBaseUrl.replace(`${AppConsts.tenancyNamePlaceHolderInUrl}.`, '');
      } else {
        AppConsts.appBaseUrl = result.appBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl, tenancyName);
        AppConsts.remoteServiceBaseUrl = result.remoteServiceBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl, tenancyName);
      }

      callback();
    });
  }

  private static getCurrentClockProvider(currentProviderName: string): abp.timing.IClockProvider {
    if (currentProviderName === 'unspecifiedClockProvider') {
      return abp.timing.unspecifiedClockProvider;
    }

    if (currentProviderName === 'utcClockProvider') {
      return abp.timing.utcClockProvider;
    }

    return abp.timing.localClockProvider;
  }

  private static impersonatedAuthenticate(impersonationToken: string, tenantId: number, callback: () => void): void {
    abp.multiTenancy.setTenantIdCookie(tenantId);
    const cookieLangValue = abp.utils.getCookieValue('Abp.Localization.CultureName') || 'zh-Hans';

    const requestHeaders = {
      '.AspNetCore.Culture': `c=${cookieLangValue}|uic=${cookieLangValue}`,
      [abp.multiTenancy.tenantIdCookieName]: abp.multiTenancy.getTenantIdCookie(),
    };

    XmlHttpRequestHelper.ajax(
      'POST',
      `${AppConsts.remoteServiceBaseUrl}/api/TokenAuth/ImpersonatedAuthenticate?impersonationToken=${impersonationToken}`,
      requestHeaders,
      null,
      (response) => {
        const result = response.result;
        abp.auth.setToken(result.accessToken);
        AppPreBootstrap.setEncryptedTokenCookie(result.encryptedAccessToken);
        location.search = '';
        callback();
      },
    );
  }

  private static linkedAccountAuthenticate(switchAccountToken: string, tenantId: number, callback: () => void): void {
    abp.multiTenancy.setTenantIdCookie(tenantId);
    const cookieLangValue = abp.utils.getCookieValue('Abp.Localization.CultureName') || 'zh-Hans';

    const requestHeaders = {
      '.AspNetCore.Culture': `c=${cookieLangValue}|uic=${cookieLangValue}`,
      [abp.multiTenancy.tenantIdCookieName]: abp.multiTenancy.getTenantIdCookie(),
    };

    XmlHttpRequestHelper.ajax(
      'POST',
      `${AppConsts.remoteServiceBaseUrl}/api/TokenAuth/LinkedAccountAuthenticate?switchAccountToken=${switchAccountToken}`,
      requestHeaders,
      null,
      (response) => {
        const result = response.result;
        abp.auth.setToken(result.accessToken);
        AppPreBootstrap.setEncryptedTokenCookie(result.encryptedAccessToken);
        location.search = '';
        callback();
      },
    );
  }

  private static getUserConfiguration(injector: Injector, callback: () => void): any {
    const cookieLangValue = abp.utils.getCookieValue('Abp.Localization.CultureName') || 'zh-Hans';
    const token = abp.auth.getToken();
    const menuService = injector.get(MenuService);
    const settingService = injector.get(SettingsService);

    // TODO:
    // settingService.setUser({name:abp.session})

    const requestHeaders = {
      '.AspNetCore.Culture': `c=${cookieLangValue}|uic=${cookieLangValue}`,
      [abp.multiTenancy.tenantIdCookieName]: abp.multiTenancy.getTenantIdCookie(),
    };
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
    return XmlHttpRequestHelper.ajax(
      'GET',
      `${AppConsts.remoteServiceBaseUrl}/AbpUserConfiguration/GetAll`,
      requestHeaders,
      null,
      (response) => {
        const result = response.result;
        _.merge(abp, result);
        abp.clock.provider = this.getCurrentClockProvider(result.clock.provider);
        AppPreBootstrap.configureMoment();
        abp.event.trigger('abp.dynamicScriptsInitialized');
        AppConsts.recaptchaSiteKey = abp.setting.get('Recaptcha.SiteKey');
        AppConsts.subscriptionExpireNotifyDayCount = parseInt(abp.setting.get('App.TenantManagement.SubscriptionExpireNotifyDayCount'), 10);

        menuService.add(AppMenus.Menus);
        settingService.setApp({ name: 'Admin', description: '' });

        // DynamicResourcesHelper.loadResources(callback);

        // 注册语言,NG-Zorro的DataPicker要使用
        registerLocaleData('zh');

        callback();
      },
    );

  }



  private static configureMoment() {
    // moment.locale(new LocaleMappingService().map('moment', abp.localization.currentLanguage.name));
    // (window as any).moment.locale(new LocaleMappingService().map('moment', abp.localization.currentLanguage.name));

    if (abp.clock.provider.supportsMultipleTimezone) {
      moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
      (window as any).moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
    } else {
      moment.fn.toJSON = function () {
        return this.format();
      };
      moment.fn.toISOString = function () {
        return this.format();
      };
    }
  }

  private static setEncryptedTokenCookie(encryptedToken: string) {
    new UtilsService().setCookieValue(
      AppConsts.authorization.encryptedAuthTokenName,
      encryptedToken,
      new Date(new Date().getTime() + 365 * 86400000), // 1 year
      abp.appPath,
    );
  }

  private static loadAssetsForInstallPage(callback) {
    abp.setting.values['App.UiManagement.Theme'] = 'default';
    abp.setting.values['default.App.UiManagement.ThemeColor'] = 'default';

    // DynamicResourcesHelper.loadResources(callback);
  }
}
