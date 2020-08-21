import { LocalizationService } from '@abp/localization/localization.service';
import { Injectable, Injector } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
@Injectable()
export class AppLocalizationService {
  localization: LocalizationService;
  constructor(injector: Injector) {
    this.localization = injector.get(LocalizationService);
  }
  l(key: string, ...args: any[]): string {
    args.unshift(key);
    args.unshift(AppConsts.localization.defaultLocalizationSourceName);
    return this.ls.apply(this, args);
  }


  ls(sourceName: string, key: string, ...args: any[]): string {
    let localizedText = this.localization.localize(key, sourceName);

    if (!localizedText) {
      localizedText = key;
    }

    if (!args || !args.length) {
      return localizedText;
    }

    args.unshift(localizedText);
    return abp.utils.formatString.apply(this, this.flattenDeep(args));
  }

  transform(key: string, ...args: any[]): string {
    return this.l(key, args);
  }

  flattenDeep(array) {
    return array.reduce((acc, val) => (Array.isArray(val) ? acc.concat(this.flattenDeep(val)) : acc.concat(val)), []);
  }
}
