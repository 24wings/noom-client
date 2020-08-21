import { Component, OnInit, Injector } from '@angular/core';
import { SendEmailActivationLinkInput, AccountServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/component-base';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-email-activation',
  templateUrl: './email-activation.component.html',
})
export class EmailActivationComponent extends AppComponentBase {
  model: SendEmailActivationLinkInput = new SendEmailActivationLinkInput();
  saving = false;
  constructor(injector: Injector, private _accountService: AccountServiceProxy, private _router: Router) {
    super(injector);
  }

  save(): void {
    this.saving = true;
    this._accountService
      .sendEmailActivationLink(this.model)
      .pipe(
        finalize(() => {
          this.saving = false;
        }),
      )
      .subscribe(() => {
        this.message.success(this.l('ActivationMailSentMessage'), this.l('MailSent')).then(() => {
          this._router.navigate(['account/login']);
        });
      });
  }
}
