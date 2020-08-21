// import { TenantRegistrationHelperService } from '@account/register-old/tenant-registration-helper.service';
import { Component, Injector, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
// import { AppComponentBase } from '@shared/common/app-component-base';
import { XmlHttpRequestHelper } from '@shared/helpers/XmlHttpRequestHelper';

import {
  EditionPaymentType,
  PaymentServiceProxy,
  PayPalConfigurationDto,
  PayPalPaymentServiceProxy,
  SubscriptionPaymentDto,
  SubscriptionPaymentGatewayType,
} from '@shared/service-proxies/service-proxies';
import { ScriptLoaderService } from '@shared/utils/script-loader.service';
import { AppComponentBase } from '@shared/common/component-base';

@Component({
  selector: 'paypal-purchase-component',
  templateUrl: './paypal-purchase.component.html',
  animations: [accountModuleAnimation()],
})
export class PayPalPurchaseComponent extends AppComponentBase implements OnInit {
  @Input() editionPaymentType: EditionPaymentType;

  config: PayPalConfigurationDto;

  paypalIsLoading = true;
  subscriptionPaymentGateway = SubscriptionPaymentGatewayType;

  totalAmount = 0;
  description = '';
  paymentId;
  redirectUrl;
  successCallbackUrl;
  errorCallbackUrl;

  constructor(
    private injector: Injector,
    private _activatedRoute: ActivatedRoute,
    private _payPalPaymentAppService: PayPalPaymentServiceProxy,
    private _paymentAppService: PaymentServiceProxy,
    private _router: Router,
    private _tenantRegistrationHelper: TenantRegistrationHelperService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.paymentId = this._activatedRoute.snapshot.queryParams.paymentId;
    this.redirectUrl = this._activatedRoute.snapshot.queryParams.redirectUrl;

    this._payPalPaymentAppService.getConfiguration().subscribe((config: PayPalConfigurationDto) => {
      this.config = config;

      new ScriptLoaderService().load('https://www.paypal.com/sdk/js?client-id=' + config.clientId).then(() => {
        this._paymentAppService.getPayment(this.paymentId).subscribe((result: SubscriptionPaymentDto) => {
          this.description = result.description;
          this.totalAmount = result.amount;
          this.successCallbackUrl = result.successUrl;
          this.errorCallbackUrl = result.errorUrl;

          this.subscriptionPaymentGateway = result.gateway as any;

          this.paypalIsLoading = false;
          this.preparePaypalButton();
        });
      });
    });
  }

  preparePaypalButton(): void {
    const self = this;
    (window as any).paypal
      .Buttons({
        createOrder(data, actions) {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: self.totalAmount,
                  currency_code: self.appSession.application.currency,
                },
              },
            ],
          });
        },
        onApprove(data, actions) {
          self._payPalPaymentAppService.confirmPayment(self.paymentId, data.orderID).subscribe(() => {
            XmlHttpRequestHelper.ajax(
              'post',
              self.successCallbackUrl + (self.successCallbackUrl.includes('?') ? '&' : '?') + 'paymentId=' + self.paymentId,
              null,
              null,
              (result) => {
                if (self._tenantRegistrationHelper.registrationResult) {
                  self._tenantRegistrationHelper.registrationResult.isActive = true;
                }
                self._router.navigate([self.redirectUrl]);
              },
            );
          });
        },
      })
      .render('#paypal-button');
  }
}
