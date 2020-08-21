import { Component, Injector, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { accountModuleAnimation } from "@shared/animations/routerTransition";

import { AppConsts } from "@shared/AppConsts";
import { AppComponentBase } from "@shared/common/app-component-base";
import {
  EditionPaymentType,
  PaymentServiceProxy,
  StripeConfigurationDto,
  StripeCreatePaymentSessionInput,
  StripePaymentServiceProxy,
  SubscriptionPaymentDto,
  SubscriptionPaymentGatewayType,
  SubscriptionStartType
} from "@shared/service-proxies/service-proxies";
import { ScriptLoaderService } from "@shared/utils/script-loader.service";

@Component({
  selector: "stripe-purchase-component",
  templateUrl: "./stripe-purchase.component.html",
  animations: [accountModuleAnimation()]
})
export class StripePurchaseComponent extends AppComponentBase implements OnInit {
  @Input() editionPaymentType: EditionPaymentType;

  amount = 0;
  description = "";

  subscriptionPayment: SubscriptionPaymentDto;
  stripeIsLoading = true;
  subscriptionPaymentGateway = SubscriptionPaymentGatewayType;
  subscriptionStartType = SubscriptionStartType;

  paymentId;
  successCallbackUrl;
  errorCallbackUrl;

  constructor(
    injector: Injector,
    private _activatedRoute: ActivatedRoute,
    private _stripePaymentAppService: StripePaymentServiceProxy,
    private _paymentAppService: PaymentServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.stripeIsLoading = true;
    this.paymentId = this._activatedRoute.snapshot.queryParams.paymentId;

    new ScriptLoaderService().load("https://js.stripe.com/v3").then(() => {
      this._stripePaymentAppService.getConfiguration().subscribe((config: StripeConfigurationDto) => {
        this._stripePaymentAppService
          .createPaymentSession(
            new StripeCreatePaymentSessionInput({
              paymentId: this.paymentId,
              successUrl: AppConsts.appBaseUrl + "/account/stripe-payment-result",
              cancelUrl: AppConsts.appBaseUrl + "/account/stripe-cancel-payment"
            })
          )
          .subscribe(sessionId => {
            this._paymentAppService.getPayment(this.paymentId).subscribe((result: SubscriptionPaymentDto) => {
              this.amount = result.amount;
              this.description = result.description;
              this.successCallbackUrl = result.successUrl;
              this.errorCallbackUrl = result.errorUrl;
              const stripe = (window as any).Stripe(config.publishableKey);
              const checkoutButton = document.getElementById("stripe-checkout");
              checkoutButton.addEventListener("click", () => {
                stripe.redirectToCheckout({ sessionId });
              });

              this.stripeIsLoading = false;
            });
          });
      });
    });
  }
}
