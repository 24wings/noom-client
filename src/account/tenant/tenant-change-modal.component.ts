import { Component, Injector, Input, OnInit } from '@angular/core';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { AccountServiceProxy, IsTenantAvailableInput, TenantAvailabilityState } from '@shared/service-proxies/service-proxies';
// import { _HttpClient } from '@delon/theme';
// import { AccountServiceProxy, IsTenantAvailableInput, TenantAvailabilityState } from 'src/shared/service-proxies/service-proxies';
// import { ModalComponentBase } from 'src/app/shared/component-base/modal-component-base';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tenant-change-modal',
  templateUrl: './tenant-change-modal.component.html',
})
export class TenantChangeModalComponent extends ModalComponentBase implements OnInit {
  @Input() tenancyName = '';
  beforeTenancyName = '';
  saving = false;
  tenancyNameBuffer = '';
  isSwitchToTenant = false;
  submitButtonText = '';
  constructor(injector: Injector, private _accountServie: AccountServiceProxy) {
    super(injector);
  }

  ngOnInit() {
    if (this.appSession?.tenant) {
      this.isSwitchToTenant = true;
    } else {
      this.isSwitchToTenant = false;

    }
    this.beforeTenancyName = this.tenancyName;
  }
  switchToTenant(e): void {
    if (e.target.checked) {
      this.tenancyName = this.tenancyNameBuffer;
      // this.focusTenancyNameInput();
    } else {
      this.tenancyNameBuffer = this.tenancyName;
      this.tenancyName = '';
    }

    this.updateSubmitButtonText();
  }
  updateSubmitButtonText(): void {
    if (this.isSwitchToTenant) {
      this.submitButtonText = this.l('SwitchToTheTenant');
    } else {
      this.submitButtonText = this.l('SwitchToTheHost');
    }
  }
  handleChange(): void {
    this.saving = true;
    if (!this.isSwitchToTenant) {
      this.tenancyName = undefined;
    }

    if (this.tenancyName === this.beforeTenancyName) {
      this.close();
      return;
    }

    if (!this.tenancyName || this.tenancyName === '') {
      abp.multiTenancy.setTenantIdCookie(undefined);
      this.close();
      location.reload();
      return;
    }


    const input = new IsTenantAvailableInput();
    input.tenancyName = this.tenancyName;

    this._accountServie
      .isTenantAvailable(input)
      .pipe(
        finalize(() => {
          this.saving = false;
        }),
      )
      .subscribe((result) => {
        switch (result.state) {
          case TenantAvailabilityState.Available:
            abp.multiTenancy.setTenantIdCookie(result.tenantId);
            this.success();
            break;
          case TenantAvailabilityState.InActive:
            this.message.warn(this.l('TenantIsNotActive', this.tenancyName));
            break;
          case TenantAvailabilityState.NotFound:
            this.message.warn(this.l('ThereIsNoTenantDefinedWithName{0}', this.tenancyName));
            break;
        }
      });
  }
}
