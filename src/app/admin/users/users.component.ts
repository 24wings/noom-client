import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { STChange, STColumn, STColumnTag } from '@delon/abc/st/table';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/component-base/paged-listing-component-base';
import { LinkedUserDto, UserListDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { PartialObserver } from 'rxjs';
import { CreateOrEditUserModalComponent } from './create-or-edit-user-modal/create-or-edit-user-modal.component';
import { EditUserPermissionsModalComponent } from './edit-user-permissions-modal/edit-user-permissions-modal.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: [],
})
export class UsersComponent extends PagedListingComponentBase<UserListDto> {
  loading = false;
  @ViewChild('editUserPermissionsModal') editUserPermissionsModal: EditUserPermissionsModalComponent;
  constructor(injector: Injector, private _userService: UserServiceProxy) {
    super(injector);
    if (this.permission.isGranted('Pages.Administration.Users.Edit')) {
      this.columns[this.columns.length - 1].buttons.push({
        text: this.l('Edit'),
        type: 'link',
        click: (e: any) => this.edit(e),
      });
    }
    if (this.permission.isGranted('Pages.Administration.Users.Delete')) {
      this.columns[this.columns.length - 1].buttons.push({
        text: this.l('Delete'),
        type: 'link',
        click: (e: any) => this.delete(e),
      });
    }

    if (this.permission.isGranted('Pages.Administration.Users.ChangePermissions')) {
      this.columns[this.columns.length - 1].buttons.push({
        text: this.l('Permissions'),
        type: 'link',
        click: (e: any) => {
          this.editUserPermissionsModal.show(e.id, e.userName);
        },
      });
    }
  }

  uploadUrl: string;
  // Filters
  advancedFiltersAreShown = false;
  filterText = '';
  role = '';
  onlyLockedUsers = false;

  pos = 0;
  columns: STColumn[] = [
    // { title: '', index: 'key', type: 'checkbox' },
    { title: this.l('Surname'), index: 'surname' },
    { title: this.l('Name'), index: 'name' },
    { title: this.l('UserName'), index: 'userName' },
    {
      title: this.l('Roles'),
      index: 'roles',
      format: (item, _col, index) => {
        const roleNames = item.roles.map((role) => role.name).join(',');
        console.log('string:', roleNames);
        return roleNames;
      },
    },
    {
      title: this.l('EmailAddress'),
      index: 'emailAddress',
    },
    {
      title: this.l('EmailConfirm'),
      index: 'isEmailConfirmed',
      type: 'yn',
    },
    { title: this.l('Active'), index: 'isActive', type: 'yn' },
    {
      title: this.l('CreationTime'),
      index: 'creationTime',
      type: 'date',
      // format:
    },
    {
      title: this.l('Actions'),
      buttons: [],
    },
  ];
  getUsers() {
    this.loading = true;
    this._userService
      .getUsers(this.filterText, undefined, undefined, this.isActive, undefined, this.pageSize, (this.pageNumber - 1) * this.pageSize)
      // .toPromise()
      // .finally(() => {
      //   finishedCallback();
      // })
      .subscribe(
        (result) => {
          this.dataList = result.items;
          this.showPaging(result);
          this.loading = false;
          this.isTableLoading = false;
        },
        () => (this.loading = false),
      );
  }

  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.getUsers();
  }

  protected delete(entity: LinkedUserDto): void {
    this.message.confirm('Delete user \'' + entity.username + '\'?', '', (result: boolean) => {
      if (result) {
        this._userService.deleteUser(entity.id).subscribe(() => {
          this.notify.info('Deleted User: ' + entity.username);
          this.refresh();
        });
      }
    });
  }

  create(): void {
    this.modalHelper
      .open(CreateOrEditUserModalComponent, {}, 'md', {
        nzMask: true,
      })
      .subscribe((isSave) => {
        if (isSave) {
          this.refresh();
        }
      });
  }

  edit(item: UserListDto): void {
    this.modalHelper
      .open(CreateOrEditUserModalComponent, { id: item.id }, 'lg', {
        nzMask: true,
      })
      .subscribe((isSave) => {
        if (isSave) {
          this.refresh();
        }
      });
  }
}
