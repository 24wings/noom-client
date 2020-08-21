import * as _ from 'lodash';
import { AppConsts } from './AppConsts';

export class LocaleMappingService {
  map(mappingSource: string, locale: string): string {
    if (!AppConsts.localeMappings && !AppConsts.localeMappings[mappingSource]) {
      return locale;
    }

    const localeMappings = _.filter(AppConsts.localeMappings[mappingSource], { from: locale });
    if (localeMappings && localeMappings.length) {
      return localeMappings[0].to;
    }

    return locale;
  }
}
