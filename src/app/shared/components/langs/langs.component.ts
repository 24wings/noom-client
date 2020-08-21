import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { ALAIN_I18N_TOKEN, SettingsService } from '@delon/theme';
import { AppComponentBase } from '@shared/common/component-base';
// import { I18NService } from '@shared/i18n/i18n.service';
import * as _ from 'lodash';

@Component({
  selector: 'pro-langs',
  templateUrl: './langs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangsComponent extends AppComponentBase implements OnInit {

  constructor(injector: Injector, public settings: SettingsService,
    //  @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService, 
    @Inject(DOCUMENT) private doc: any) {
    super(injector);
    // this.langs = this.i18n.getLangs().map((v: any) => {
    //   v.abbr = '🇨🇳';
    //   switch (v.code) {
    //     case 'zh-TW':
    //       v.abbr = '🇭🇰';
    //       break;
    //     case 'en-US':
    //       v.abbr = '🇬🇧';
    //       break;
    //   }
    //   return v;
    // });
  }
  langs: any[];

  @Input() placement = 'bottomRight';
  @Input() btnClass = 'alain-pro__header-item';
  @Input() btnIconClass = 'alain-pro__header-item-icon';

  currentLanguage: abp.localization.ILanguageInfo;
  languages: abp.localization.ILanguageInfo[] = [];

  change(lang: string) {
    const spinEl = this.doc.createElement('div');
    spinEl.setAttribute('class', `page-loading ant-spin ant-spin-lg ant-spin-spinning`);
    spinEl.innerHTML = `<span class="ant-spin-dot ant-spin-dot-spin"><i></i><i></i><i></i><i></i></span>`;
    this.doc.body.appendChild(spinEl);

    // this.i18n.use(lang);
    this.settings.setLayout('lang', lang);
    setTimeout(() => this.doc.location.reload());
  }

  // constructor(injector: Injector) {
  //   super(injector);
  // }

  ngOnInit(): void {
    this.languages = _.filter(abp.localization.languages, l => (l as any).isDisabled === false);
    this.currentLanguage = abp.localization.currentLanguage;
  }

  changeLanguage(language: abp.localization.ILanguageInfo) {
    abp.utils.setCookieValue(
      'Abp.Localization.CultureName',
      language.name,
      new Date(new Date().getTime() + 5 * 365 * 86400000), // 5 year
      abp.appPath
    );

    location.reload();
  }
}
