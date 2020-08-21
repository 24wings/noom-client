import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConsts } from '@app/shared';
import { AppComponentBase } from '@shared/common/component-base/app-component-base';
import _ from 'lodash';
import moment from 'moment';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.less'],
})
export class AccountComponent extends AppComponentBase implements OnInit {
  constructor(injector: Injector, private _router: Router) {
    super(injector);
  }
  links = [
    {
      title: '帮助',
      href: '',
    },
    {
      title: '隐私',
      href: '',
    },
    {
      title: '条款',
      href: '',
    },
  ];
  currentYear: number = moment().year();
  remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;
  tenantChangeDisabledRoutes: string[] = [
    'select-edition',
    'buy',
    'upgrade',
    'extend',
    'register-tenant',
    'stripe-purchase',
    'stripe-subscribe',
    'stripe-update-subscription',
    'paypal-purchase',
    'stripe-payment-result',
    'payment-completed',
    'stripe-cancel-payment',
  ];

  private static supportsTenancyNameInUrl() {
    return AppConsts.appBaseUrlFormat && AppConsts.appBaseUrlFormat.indexOf(AppConsts.tenancyNamePlaceHolderInUrl) >= 0;
  }

  ngOnInit(): void { }

  showTenantChange(): boolean {
    if (!this._router.url) {
      return false;
    }

    if (_.filter(this.tenantChangeDisabledRoutes, (route) => this._router.url.indexOf('/account/' + route) >= 0).length) {
      return false;
    }

    return abp.multiTenancy.isEnabled && !AccountComponent.supportsTenancyNameInUrl();
  }
}
