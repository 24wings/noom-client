import { Component, Injector, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { accountModuleAnimation } from "@shared/animations/routerTransition";
import { AppConsts } from "@shared/AppConsts";
import { AppComponentBase } from "@shared/common/app-component-base";
import {
  CreatePaymentDto,
  EditionPaymentType,
  EditionSelectDto,
  PaymentGatewayModel,
  PaymentInfoDto,
  PaymentPeriodType,
  PaymentServiceProxy,
  SubscriptionPaymentGatewayType
} from "@shared/service-proxies/service-proxies";
import { PaymentHelperService } from "./payment-helper.service";

@Component({
  templateUrl: "./extend.component.html",
  animations: [accountModuleAnimation()]
})
export class ExtendEditionComponent extends AppComponentBase implements OnInit {
  editionPaymentType: EditionPaymentType;
  edition: EditionSelectDto = new EditionSelectDto();
  tenantId: number = abp.session.tenantId;
  paymentPeriodType = PaymentPeriodType;
  subscriptionPaymentGateway = SubscriptionPaymentGatewayType;
  selectedPaymentPeriodType: PaymentPeriodType;
  additionalPrice: number;
  editionPaymentTypeCheck: typeof EditionPaymentType = EditionPaymentType;
  paymentGateways: PaymentGatewayModel[];

  constructor(
    injector: Injector,
    private _router: Router,
    private _paymentHelperService: PaymentHelperService,
    private _activatedRoute: ActivatedRoute,
    private _paymentAppService: PaymentServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.editionPaymentType = parseInt(this._activatedRoute.snapshot.queryParams.editionPaymentType, 10);

    this._paymentAppService.getPaymentInfo(undefined).subscribe((result: PaymentInfoDto) => {
      this.edition = result.edition;
      this.additionalPrice = Number(result.additionalPrice.toFixed(2));
      this.selectedPaymentPeriodType = this._paymentHelperService.getInitialSelectedPaymentPeriodType(this.edition);
    });

    this._paymentAppService.getActiveGateways(undefined).subscribe((result: PaymentGatewayModel[]) => {
      this.paymentGateways = result;
    });
  }

  checkout(gatewayType) {
    const input = {} as CreatePaymentDto;
    input.editionId = this.edition.id;
    input.editionPaymentType = this.editionPaymentType as any;
    input.paymentPeriodType = this.selectedPaymentPeriodType as any;
    input.recurringPaymentEnabled = false;
    input.subscriptionPaymentGatewayType = gatewayType;
    input.successUrl = AppConsts.remoteServiceBaseUrl + "/api/services/app/payment/" + this._paymentHelperService.getEditionPaymentType(this.editionPaymentType) + "Succeed";
    input.errorUrl = AppConsts.remoteServiceBaseUrl + "/api/services/app/payment/PaymentFailed";

    this._paymentAppService.createPayment(input).subscribe((paymentId: number) => {
      this._router.navigate(["account/" + this.getPaymentGatewayType(gatewayType).toLocaleLowerCase() + "-purchase"], {
        queryParams: {
          paymentId,
          redirectUrl: "app/admin/subscription-management"
        }
      });
    });
  }

  getPaymentGatewayType(gatewayType): string {
    return this._paymentHelperService.getPaymentGatewayType(gatewayType);
  }

  onPaymentPeriodChangeChange(selectedPaymentPeriodType) {
    this.selectedPaymentPeriodType = selectedPaymentPeriodType;
  }

  isUpgrade(): boolean {
    return this.additionalPrice > 0;
  }
}
