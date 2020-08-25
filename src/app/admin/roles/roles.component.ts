import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { EntityTypeHistoryModalComponent } from '@app/shared/common/entityHistory/entity-type-history-modal.component';
import { STColumn, STComponent } from '@delon/abc/st/table';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/component-base';
import { RoleListDto, RoleServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { PagedListingComponentBase, PagedRequestDto } from '../../../shared/common/component-base/paged-listing-component-base';
import { getCheckedTreeNodes } from '../../shared/utils/list-to-tree.service';
import { PermissionTreeModalComponent } from '../shared/permission-tree-modal.component';
import { CreateOrEditRoleModalComponent } from './create-or-edit-role-modal.component';

@Component({
  templateUrl: './roles.component.html',

})
export class RolesComponent extends PagedListingComponentBase<RoleListDto> implements OnInit {
  loading = false;
  columns: STColumn[] = [
    { type: 'checkbox', index: 'checked' },
    { title: this.l('RoleName'), index: 'displayName', render: 'name', sort: true },
    { title: this.l('CreationTime'), index: 'creationTime', type: 'date', sort: true },
    {
      buttons: [

      ]
    }
  ];
  constructor(injector: Injector, private _roleService: RoleServiceProxy) {
    super(injector);
    const actionColumn = this.columns[this.columns.length - 1];
    if (this.permission.isGranted('Pages.Administration.Roles.Edit')) {
      actionColumn.buttons.push({ text: this.l('Edit'), click: (e: any) => this.createOrEditRoleModal.show(e.id) });
    }
    if (this.permission.isGranted('Pages.Administration.Roles.Delete')) {
      actionColumn.buttons.push({ text: this.l('Delete'), click: (e: any) => this.deleteRole(e) });
    }

  }
  @ViewChild('createOrEditRoleModal', { static: true }) createOrEditRoleModal: CreateOrEditRoleModalComponent;
  @ViewChild('entityTypeHistoryModal', { static: true }) entityTypeHistoryModal: EntityTypeHistoryModalComponent;
  @ViewChild('dataTable', { static: true }) dataTable: STComponent;
  @ViewChild('permissionFilterTreeModal', { static: true }) permissionFilterTreeModal: PermissionTreeModalComponent;

  _entityTypeFullName = 'AbpDemo.Study.Authorization.Roles.Role';
  entityHistoryEnabled = false;
  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.getRoles();
  }

  ngOnInit(): void {
    this.setIsEntityHistoryEnabled();
    this.getRoles();
  }

  getRoles(): void {
    // this.primengTableHelper.showLoadingIndicator();
    const selectedPermissions = this.permissionFilterTreeModal.getSelectedPermissions();
    this.loading = true;
    this._roleService
      .getRoles(selectedPermissions)
      // .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
      .subscribe(result => {

        this.dataList = result.items;
        this.totalItems = result.items.length;
        this.loading = false;
      }, () => this.loading = false);
  }

  createRole(): void {
    this.createOrEditRoleModal.show();
  }

  showHistory(role: RoleListDto): void {
    this.entityTypeHistoryModal.show({
      entityId: role.id.toString(),
      entityTypeFullName: this._entityTypeFullName,
      entityTypeDescription: role.displayName
    });
  }

  deleteRole(role: RoleListDto): void {
    const self = this;
    self.message.confirm(self.l('RoleDeleteWarningMessage', role.displayName), this.l('AreYouSure'), isConfirmed => {
      if (isConfirmed) {
        this._roleService.deleteRole(role.id).subscribe(() => {
          this.getRoles();
          abp.notify.success(this.l('SuccessfullyDeleted'));
        });
      }
    });
  }
  deleteRoleBat() {
    this.message.confirm(this.l('RoleDeleteWarningMessage', ''), this.l('AreYouSure'), async isConfirmed => {
      if (isConfirmed) {
        const data = this.dataList.filter((item: any) => item.checked);
        for (const role of data) {
          await this._roleService.deleteRole(role.id).toPromise();
        }
        this.getRoles();
        abp.notify.success(this.l('SuccessfullyDeleted'));
      }
    });
  }
  getSelectedItems() {
    return this.dataList.filter((item: any) => item.checked).length;
  }

  private setIsEntityHistoryEnabled(): void {
    const customSettings = (abp as any).custom;
    this.entityHistoryEnabled =
      customSettings.EntityHistory &&
      customSettings.EntityHistory.isEnabled &&
      _.filter(customSettings.EntityHistory.enabledEntities, entityType => entityType === this._entityTypeFullName).length === 1;
  }
}
