import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountServiceProxy, ActivateEmailInput, ResolveTenantIdInput } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/component-base';

@Component({
  template: `
    <div class="kt-login__form">
      <div class="alert alert-success text-center" role="alert">
        <div class="alert-text">{{ waitMessage }}</div>
      </div>
    </div>
  `,
})
export class ConfirmEmailComponent extends AppComponentBase implements OnInit {
  waitMessage: string;

  model: ActivateEmailInput = new ActivateEmailInput();

  constructor(
    injector: Injector,
    private _accountService: AccountServiceProxy,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.waitMessage = this.l('PleaseWaitToConfirmYourEmailMessage');

    this.model.c = this._activatedRoute.snapshot.queryParams.c;

    this._accountService.resolveTenantId(new ResolveTenantIdInput({ c: this.model.c })).subscribe((tenantId) => {
      const reloadNeeded = this.appSession.changeTenantIfNeeded(tenantId);

      if (reloadNeeded) {
        return;
      }

      this._accountService.activateEmail(this.model).subscribe(() => {
        this.notify.success(this.l('YourEmailIsConfirmedMessage'), '', {
          onClose: () => {
            this._router.navigate(['account/login']);
          },
        });
      });
    });
  }

  parseTenantId(tenantIdAsStr?: string): number {
    let tenantId = !tenantIdAsStr ? undefined : parseInt(tenantIdAsStr, 10);
    if (isNaN(tenantId)) {
      tenantId = undefined;
    }

    return tenantId;
  }
}
