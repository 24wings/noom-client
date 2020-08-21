import { AbpMultiTenancyService } from '@abp/multi-tenancy/abp-multi-tenancy.service';
import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { LinkedAccountService } from '@app/shared/layout/linked-account.service';

import { LinkedUserDto, UnlinkUserInput, UserLinkServiceProxy } from '@shared/service-proxies/service-proxies';

import { STColumn, STComponent } from '@delon/abc';
import { finalize } from 'rxjs/operators';
import { PagedListingComponentBase, PagedRequestDto } from '../../../shared/common/component-base/paged-listing-component-base';
import { LinkAccountModalComponent } from './link-account-modal.component';

@Component({
  selector: 'linkedAccountsModal',
  templateUrl: './linked-accounts-modal.component.html'
})
export class LinkedAccountsModalComponent extends PagedListingComponentBase<LinkedUserDto> {
  loading = false;
  columns: STColumn[] = [
    { title: this.l('UserName'), index: 'username', format: (record: any) => this.getShownLinkedUserName(record) },
    { title: this.l('Actions'), buttons: [] }
  ];
  active = false;
  constructor(
    injector: Injector,
    private abpMultiTenancyService: AbpMultiTenancyService,
    private _userLinkService: UserLinkServiceProxy,
    private _linkedAccountService: LinkedAccountService
  ) {
    super(injector);
  }
  @ViewChild('linkAccountModal', { static: true }) linkAccountModal: LinkAccountModalComponent;
  @ViewChild('dataTable', { static: true }) dataTable: STComponent;

  @Output() modalClose: EventEmitter<any> = new EventEmitter<any>();
  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.getLinkedUsers();
  }

  getLinkedUsers(event?) {
    // this.primengTableHelper.showLoadingIndicator();
    this.loading = true;
    this._userLinkService
      .getLinkedUsers(
        this.pageSize,
        (this.pageNumber - 1) * this.pageSize,
        undefined
      )
      .pipe(finalize(() => this.loading = false))
      .subscribe(result => {
        this.totalItems = result.totalCount;
        this.dataList = result.items;
        this.loading = false;
      });
  }

  getShownLinkedUserName(linkedUser: LinkedUserDto): string {
    if (!this.abpMultiTenancyService.isEnabled) {
      return linkedUser.username;
    }

    return (linkedUser.tenantId ? linkedUser.tenancyName : '.') + '\\' + linkedUser.username;
  }

  deleteLinkedUser(linkedUser: LinkedUserDto): void {
    this.message.confirm(this.l('LinkedUserDeleteWarningMessage', linkedUser.username), this.l('AreYouSure'), isConfirmed => {
      if (isConfirmed) {
        const unlinkUserInput = new UnlinkUserInput();
        unlinkUserInput.userId = linkedUser.id;
        unlinkUserInput.tenantId = linkedUser.tenantId;

        this._userLinkService.unlinkUser(unlinkUserInput).subscribe(() => {
          this.reloadPage();
          this.notify.success(this.l('SuccessfullyUnlinked'));
        });
      }
    });
  }

  reloadPage(): void {
    // this.paginator.changePage(this.paginator.getPage());
  }

  manageLinkedAccounts(): void {
    this.linkAccountModal.show();
  }

  switchToUser(linkedUser: LinkedUserDto): void {
    this._linkedAccountService.switchToAccount(linkedUser.id, linkedUser.tenantId);
  }

  shown(): void {
    this.active = true;
  }

  close(): void {
    // this.modal.hide();
    this.active = false;
    this.modalClose.emit(null);
  }
}
