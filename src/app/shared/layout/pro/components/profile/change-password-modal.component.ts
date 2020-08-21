import { Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/component-base';
import { ChangePasswordInput, PasswordComplexitySetting, ProfileServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'changePasswordModal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.less']
})
export class ChangePasswordModalComponent extends AppComponentBase {
  @ViewChild('currentPasswordInput', { static: true }) currentPasswordInput: ElementRef;

  passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
  currentPassword: string;
  password: string;
  confirmPassword: string;

  saving = false;
  active = false;

  constructor(injector: Injector, private _profileService: ProfileServiceProxy) {
    super(injector);
  }

  show(): void {
    this.active = true;
    this.currentPassword = '';
    this.password = '';
    this.confirmPassword = '';

    this._profileService.getPasswordComplexitySetting().subscribe(result => {
      this.passwordComplexitySetting = result.setting;
      // this.modal.show();
    });
  }

  onShown(): void {
    document.getElementById('CurrentPassword').focus();
  }

  close(): void {
    this.active = false;
    // this.modal.hide();
  }

  save(): void {
    const input = new ChangePasswordInput();
    input.currentPassword = this.currentPassword;
    input.newPassword = this.password;

    this.saving = true;
    this._profileService
      .changePassword(input)
      .pipe(
        finalize(() => {
          this.saving = false;
          this.close();
        })
      )
      .subscribe(() => {
        this.saving = false;
        this.close();
        this.notify.info(this.l('YourPasswordHasChangedSuccessfully'));

      });
  }
}
