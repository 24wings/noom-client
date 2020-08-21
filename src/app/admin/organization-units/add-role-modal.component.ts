import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { STColumn } from '@delon/abc/st/table';
import { AppComponentBase, PagedListingComponentBase, PagedRequestDto } from '@shared/common/component-base';
// import { AppComponentBase } from '@shared/common/app-component-base';
import { FindOrganizationUnitRolesInput, NameValueDto, OrganizationUnitServiceProxy, RolesToOrganizationUnitInput } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
// import { ModalDirective } from 'ngx-bootstrap';
// import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
// import { Paginator } from 'primeng/components/paginator/paginator';
// import { Table } from 'primeng/components/table/table';
import { finalize } from 'rxjs/operators';
import { IRolesWithOrganizationUnit } from './roles-with-organization-unit';

@Component({
  selector: 'addRoleModal',
  templateUrl: './add-role-modal.component.html'
})
export class AddRoleModalComponent extends PagedListingComponentBase<NameValueDto> {
  loading = false;
  columns: STColumn[] = [
    { type: 'checkbox', index: 'checked' },
    { title: this.l('Name'), index: 'name' },

  ];
  constructor(injector: Injector, private _organizationUnitService: OrganizationUnitServiceProxy) {
    super(injector);
  }
  organizationUnitId: number;

  @Output() rolesAdded: EventEmitter<IRolesWithOrganizationUnit> = new EventEmitter<IRolesWithOrganizationUnit>();
  data = [];
  // @ViewChild('modal', { static: true }) modal: ModalDirective;
  // @ViewChild('dataTable', { static: true }) dataTable: Table;
  // @ViewChild('paginator', { static: true }) paginator: Paginator;

  isShown = false;
  filterText = '';
  tenantId?: number;
  saving = false;

  selectedRoles: NameValueDto[];
  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
  }



  refreshTable(): void {
    // this.paginator.changePage(this.paginator.getPage());
  }

  close(): void {
    // this.modal.hide();
    this.isShown = false;
  }

  shown(): void {
    this.isShown = true;
    this.getRecordsIfNeeds(null);
  }

  getRecordsIfNeeds(event): void {
    if (!this.isShown) {
      return;
    }

    this.getRecords(event);
  }

  getRecords(event?): void {
    // if (this.primengTableHelper.shouldResetPaging(event)) {
    //   this.paginator.changePage(0);

    //   return;
    // }

    // this.primengTableHelper.showLoadingIndicator();

    const input = new FindOrganizationUnitRolesInput();
    input.organizationUnitId = this.organizationUnitId;
    input.filter = this.filterText;
    input.skipCount = this.pageSize * (this.pageNumber - 1);
    input.maxResultCount = this.pageSize;
    this.loading = true;
    this._organizationUnitService
      .findRoles(input)
      // .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
      .subscribe(result => {
        this.totalItems = result.totalCount;
        this.dataList = result.items;
        this.loading = false;
        // this.primengTableHelper.hideLoadingIndicator();
      }, () => this.loading = false);
  }

  addRolesToOrganizationUnit(): void {
    const input = new RolesToOrganizationUnitInput();
    input.organizationUnitId = this.organizationUnitId;
    input.roleIds = _.map(this.dataList.filter((item: any) => item.checked), selectedRole => Number(selectedRole.value));
    this.saving = true;
    this._organizationUnitService.addRolesToOrganizationUnit(input).subscribe(() => {
      // this.notify.success(this.l('SuccessfullyAdded'));
      this.rolesAdded.emit({
        roleIds: input.roleIds,
        ouId: input.organizationUnitId
      });
      this.saving = false;
      this.close();
      this.selectedRoles = [];
    });
  }
}
