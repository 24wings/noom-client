import { AfterViewInit, Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import {
  IOrganizationUnitsTreeComponentData,
  OrganizationUnitsTreeComponent,
} from '@app/admin/shared/organization-unit-tree/organization-unit-tree.component';
import { AppConsts } from '@app/shared';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import {
  GetUserForEditOutput,
  OrganizationUnitDto,
  PasswordComplexitySetting,
  ProfileServiceProxy,
  RoleServiceProxy,
  UserRoleDto,
  UserServiceProxy,
  UserEditDto,
  CreateOrUpdateUserInput,
} from '@shared/service-proxies/service-proxies';
import _ from 'lodash';
import { NzModalRef } from 'ng-zorro-antd';
import { finalize } from 'rxjs/operators';
// import { ModalComponentBase } from '@shared/component-base';
// import {  RoleServiceProxy, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-create-or-edit-user-modal',
  templateUrl: './create-or-edit-user-modal.component.html',
  styles: [],
})
export class CreateOrEditUserModalComponent extends ModalComponentBase implements OnInit {
  // @ViewChild('organizationUnitTree', { static: false }) organizationUnitTree: OrganizationUnitsTreeComponent;
  @ViewChild('organizationUnitTree', { static: false }) organizationUnitTree: OrganizationUnitsTreeComponent;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @Input() id;
  active = false;
  saving = false;
  canChangeUserName = true;
  isTwoFactorEnabled: boolean = this.setting.getBoolean('Abp.Zero.UserManagement.TwoFactorLogin.IsEnabled');
  isLockoutEnabled: boolean = this.setting.getBoolean('Abp.Zero.UserManagement.UserLockOut.IsEnabled');
  passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
  avatarUrl;
  loading = false;
  user: UserEditDto = new UserEditDto();
  roles: UserRoleDto[];
  sendActivationEmail = true;
  setRandomPassword = true;
  passwordComplexityInfo = '';
  profilePicture: string;

  allOrganizationUnits: OrganizationUnitDto[];
  memberedOrganizationUnits: string[];
  userPasswordRepeat = '';

  constructor(
    injector: Injector,
    private _userService: UserServiceProxy,
    private _profileService: ProfileServiceProxy,
    private modal: NzModalRef,
  ) {
    super(injector);
  }
  ngOnInit(): void {
    if (this.id) {
      this.show(this.id);
    } else {
      this.show();
    }
  }

  show(userId?: number): void {
    if (!userId) {
      this.active = true;
      this.setRandomPassword = true;
      this.sendActivationEmail = true;
    }

    this._userService.getUserForEdit(userId).subscribe((userResult) => {
      this.user = userResult.user;
      this.roles = userResult.roles;
      this.canChangeUserName = this.user.userName !== AppConsts.userManagement.defaultAdminUserName;

      this.allOrganizationUnits = userResult.allOrganizationUnits;
      this.memberedOrganizationUnits = userResult.memberedOrganizationUnits;

      this.getProfilePicture(userResult.profilePictureId);

      if (userId) {
        this.active = true;

        setTimeout(() => {
          this.setRandomPassword = false;
        }, 0);

        this.sendActivationEmail = false;
      }

      this._profileService.getPasswordComplexitySetting().subscribe((passwordComplexityResult) => {
        this.passwordComplexitySetting = passwordComplexityResult.setting;
        this.setPasswordComplexityInfo();
        // this.modal.show();

        this.organizationUnitTree.data = {
          allOrganizationUnits: this.allOrganizationUnits,
          selectedOrganizationUnits: this.memberedOrganizationUnits,
        } as IOrganizationUnitsTreeComponentData;
      });
    });
  }

  setPasswordComplexityInfo(): void {
    this.passwordComplexityInfo = '<ul>';

    if (this.passwordComplexitySetting.requireDigit) {
      this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireDigit_Hint') + '</li>';
    }

    if (this.passwordComplexitySetting.requireLowercase) {
      this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireLowercase_Hint') + '</li>';
    }

    if (this.passwordComplexitySetting.requireUppercase) {
      this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireUppercase_Hint') + '</li>';
    }

    if (this.passwordComplexitySetting.requireNonAlphanumeric) {
      this.passwordComplexityInfo += '<li>' + this.l('PasswordComplexity_RequireNonAlphanumeric_Hint') + '</li>';
    }

    if (this.passwordComplexitySetting.requiredLength) {
      this.passwordComplexityInfo +=
        '<li>' + this.l('PasswordComplexity_RequiredLength_Hint', this.passwordComplexitySetting.requiredLength) + '</li>';
    }

    this.passwordComplexityInfo += '</ul>';
  }

  getProfilePicture(profilePictureId: string): void {
    if (!profilePictureId) {
      this.profilePicture = this.appRootUrl() + 'assets/common/images/default-profile-picture.png';
    } else {
      this._profileService.getProfilePictureById(profilePictureId).subscribe((result) => {
        if (result && result.profilePicture) {
          this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
        } else {
          this.profilePicture = this.appRootUrl() + 'assets/common/images/default-profile-picture.png';
        }
      });
    }
  }

  onShown(): void {
    // this.organizationUnitTree.data = {
    //   allOrganizationUnits: this.allOrganizationUnits,
    //   selectedOrganizationUnits: this.memberedOrganizationUnits
    // } as IOrganizationUnitsTreeComponentData;

    document.getElementById('Name').focus();
  }

  save(): void {
    const input = new CreateOrUpdateUserInput();

    input.user = this.user;
    input.setRandomPassword = this.setRandomPassword;
    input.sendActivationEmail = this.sendActivationEmail;
    input.assignedRoleNames = _.map(
      _.filter(this.roles, { isAssigned: true, inheritedFromOrganizationUnit: false }),
      (role) => role.roleName,
    );

    input.organizationUnits = this.organizationUnitTree.getSelectedOrganizations();

    this.saving = true;
    this._userService
      .createOrUpdateUser(input)
      .pipe(
        finalize(() => {
          this.saving = false;
        }),
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.close();
        this.modalSave.emit(null);
      });
  }

  close(): void {
    this.active = false;
    this.userPasswordRepeat = '';
    // this.modal.hide();
    this.modal.close();
  }

  getAssignedRoleCount(): number {
    return _.filter(this.roles, { isAssigned: true }).length;
  }
}
