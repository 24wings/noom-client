import { AppConsts } from '@shared/AppConsts';
import { FormattedStringValueExtractor } from './FormattedStringValueExtractor';

export class SubdomainTenancyNameFinder {
  getCurrentTenancyNameOrNull(rootAddress: string): string {
    if (rootAddress.indexOf(AppConsts.tenancyNamePlaceHolderInUrl) < 0) {
      // Web site does not support subdomain tenant name
      return null;
    }

    const currentRootAddress = document.location.href;

    const formattedStringValueExtractor = new FormattedStringValueExtractor();
    const values: any[] = formattedStringValueExtractor.IsMatch(currentRootAddress, rootAddress);
    if (!values.length) {
      return null;
    }

    return values[0];
  }
}
