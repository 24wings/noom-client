import { Component, Injector, ViewChild } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/component-base';
import { ProfileServiceProxy, UserLoginAttemptDto, UserLoginServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';

@Component({
  selector: 'loginAttemptsModal',
  templateUrl: './login-attempts-modal.component.html'
})
export class LoginAttemptsModalComponent extends AppComponentBase {
  active = false;
  userLoginAttempts: UserLoginAttemptDto[];
  profilePicture = AppConsts.appBaseUrl + '/assets/common/images/default-profile-picture.png';
  defaultProfilePicture = AppConsts.appBaseUrl + '/assets/common/images/default-profile-picture.png';

  constructor(injector: Injector, private _userLoginService: UserLoginServiceProxy, private _profileService: ProfileServiceProxy) {
    super(injector);
  }

  show(): void {
    this.active = true;
    this._userLoginService.getRecentUserLoginAttempts().subscribe(result => {
      this.userLoginAttempts = result.items;
      this._profileService.getProfilePicture().subscribe(data => {
        if (data && data.profilePicture) {
          this.profilePicture = 'data:image/jpeg;base64,' + data.profilePicture;
        }
        // this.modal.show();
      });
    });
  }

  close(): void {
    this.active = false;
    // this.modal.hide();
  }

  setProfilePictureClass(userLoginAttemptResult: string): any {
    return {
      label: true,
      'label-success': userLoginAttemptResult === 'Success',
      'label-danger': userLoginAttemptResult !== 'Success'
    };
  }

  getLoginAttemptTime(userLoginAttempt: UserLoginAttemptDto): string {
    return moment(userLoginAttempt.creationTime).fromNow() + ' (' + moment(userLoginAttempt.creationTime).format('YYYY-MM-DD hh:mm:ss') + ')';
  }
}
