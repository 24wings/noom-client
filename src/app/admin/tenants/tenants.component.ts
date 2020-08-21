import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImpersonationService } from '@app/admin/users/impersonation.service';
import { EntityTypeHistoryModalComponent } from '@app/shared/common/entityHistory/entity-type-history-modal.component';
import { STColumn, STComponent } from '@delon/abc/st/table';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/component-base';
import { CommonLookupModalComponent } from '@shared/common/lookup/common-lookup-modal.component';
import { CommonLookupServiceProxy, EntityDtoOfInt64, FindUsersInput, NameValueDto, TenantListDto, TenantServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { PagedListingComponentBase, PagedRequestDto } from '../../../shared/common/component-base/paged-listing-component-base';
import { CreateTenantModalComponent } from './create-tenant-modal.component';
import { EditTenantModalComponent } from './edit-tenant-modal.component';
import { TenantFeaturesModalComponent } from './tenant-features-modal.component';

@Component({
  templateUrl: './tenants.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class TenantsComponent extends PagedListingComponentBase<TenantListDto> implements OnInit {
  loading = false;
  columns: STColumn[] = [
    { type: 'checkbox', index: 'checked' },
    { index: 'tenancyName', title: this.l('TenantName') },
    { index: 'name', title: this.l('Name') },
    { index: 'editionDisplayName', title: this.l('Edition') },
    { index: 'subscriptionEndDateUtc', title: this.l('SubscriptionEndDateUtc') },
    { index: 'isActive', title: this.l('Active'), type: 'yn' },
    { index: 'creationTime', title: this.l('CreationTime'), type: 'date' },
    {
      title: this.l('Actions'), buttons: [

      ]
    }

  ];

  constructor(
    injector: Injector,
    private _tenantService: TenantServiceProxy,
    private _activatedRoute: ActivatedRoute,
    private _commonLookupService: CommonLookupServiceProxy,
    private _impersonationService: ImpersonationService
  ) {
    super(injector);
    this.setFiltersFromRoute();
    const actionColumns = this.columns[this.columns.length - 1];
    if (this.permission.isGranted('Pages.Tenants.Impersonation')) {
      actionColumns.buttons.push({ text: this.l('LoginAsThisTenant'), click: (record: any) => record.isActive && this.showUserImpersonateLookUpModal(record) });
    }
    if (this.permission.isGranted('Pages.Tenants.Edit')) {

      actionColumns.buttons.push({ text: this.l('Edit'), click: (record: any) => this.editTenantModal.show(record.id) });
    }
    if (this.permission.isGranted('Pages.Tenants.ChangeFeatures')) {
      actionColumns.buttons.push({ text: this.l('Features'), click: (record) => this.tenantFeaturesModal.show(record.id, record.name) });
    }
    if (this.permission.isGranted('Pages.Tenants.Delete')) {
      actionColumns.buttons.push({ text: this.l('Delete'), click: (record: any) => this.deleteTenant(record) });
    }

    actionColumns.buttons.push({ text: this.l('Unlock'), click: (record: any) => this.unlockUser(record) });
    actionColumns.buttons.push({ text: this.l('History'), click: (record: any) => this.showHistory(record), iif: () => this.entityHistoryEnabled });



  }
  @ViewChild('impersonateUserLookupModal', { static: true }) impersonateUserLookupModal: CommonLookupModalComponent;
  @ViewChild('createTenantModal', { static: true }) createTenantModal: CreateTenantModalComponent;
  @ViewChild('editTenantModal', { static: true }) editTenantModal: EditTenantModalComponent;
  @ViewChild('tenantFeaturesModal', { static: true }) tenantFeaturesModal: TenantFeaturesModalComponent;
  @ViewChild('dataTable', { static: true }) dataTable: STComponent;
  // @ViewChild('paginator', { static: true }) paginator: Paginator;
  @ViewChild('entityTypeHistoryModal', { static: true }) entityTypeHistoryModal: EntityTypeHistoryModalComponent;

  subscriptionDateRange: Date[] = [
    moment().startOf('day').toDate(),
    moment()
      .add(30, 'days')
      .endOf('day').toDate()
  ];
  creationDateRange: Date[] = [moment().startOf('day').toDate(), moment().endOf('day').toDate()];

  _entityTypeFullName = 'AbpDemo.Study.MultiTenancy.Tenant';
  entityHistoryEnabled = false;

  filters: {
    filterText: string;
    creationDateRangeActive: boolean;
    subscriptionEndDateRangeActive: boolean;
    selectedEditionId: string;
  } = {} as any;
  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
  }

  setFiltersFromRoute(): void {
    if (this._activatedRoute.snapshot.queryParams.subscriptionEndDateStart != null) {
      this.filters.subscriptionEndDateRangeActive = true;
      this.subscriptionDateRange[0] = moment(this._activatedRoute.snapshot.queryParams.subscriptionEndDateStart).toDate();
    } else {
      this.subscriptionDateRange[0] = moment().startOf('day').toDate();
    }

    if (this._activatedRoute.snapshot.queryParams.subscriptionEndDateEnd != null) {
      this.filters.subscriptionEndDateRangeActive = true;
      this.subscriptionDateRange[1] = moment(this._activatedRoute.snapshot.queryParams.subscriptionEndDateEnd).toDate();
    } else {
      this.subscriptionDateRange[1] = moment()
        .add(30, 'days')
        .endOf('day').toDate();
    }

    if (this._activatedRoute.snapshot.queryParams.creationDateStart != null) {
      this.filters.creationDateRangeActive = true;
      this.creationDateRange[0] = moment(this._activatedRoute.snapshot.queryParams.creationDateStart).toDate();
    } else {
      this.creationDateRange[0] = moment()
        .add(-7, 'days')
        .startOf('day').toDate();
    }

    if (this._activatedRoute.snapshot.queryParams.creationDateEnd != null) {
      this.filters.creationDateRangeActive = true;
      this.creationDateRange[1] = moment(this._activatedRoute.snapshot.queryParams.creationDateEnd).toDate();
    } else {
      this.creationDateRange[1] = moment().endOf('day').toDate();
    }

    if (this._activatedRoute.snapshot.queryParams.editionId != null) {
      this.filters.selectedEditionId = this._activatedRoute.snapshot.queryParams.editionId;
    }
  }

  ngOnInit(): void {
    this.filters.filterText = this._activatedRoute.snapshot.queryParams.filterText || '';

    this.setIsEntityHistoryEnabled();

    this.impersonateUserLookupModal.configure({
      title: this.l('SelectAUser'),
      dataSource: (skipCount: number, maxResultCount: number, filter: string, tenantId?: number) => {
        const input = new FindUsersInput();
        input.filter = filter;
        input.maxResultCount = maxResultCount;
        input.skipCount = skipCount;
        input.tenantId = tenantId;
        return this._commonLookupService.findUsers(input);
      }
    });
    this.getTenants();
  }

  getTenants(event?) {
    // if (this.primengTableHelper.shouldResetPaging(event)) {
    //   this.paginator.changePage(0);

    //   return;
    // }

    // this.primengTableHelper.showLoadingIndicator();
    this.loading = true;
    this._tenantService
      .getTenants(
        this.filters.filterText,
        this.filters.subscriptionEndDateRangeActive ? moment(this.subscriptionDateRange[0]) : undefined,
        this.filters.subscriptionEndDateRangeActive ? moment(this.subscriptionDateRange[1]).endOf('day') : undefined,
        this.filters.creationDateRangeActive ? moment(this.creationDateRange[0]) : undefined,
        this.filters.creationDateRangeActive ? moment(this.creationDateRange[1]).endOf('day') : undefined,
        parseInt(this.filters.selectedEditionId, 10) || undefined,
        this.filters.selectedEditionId !== undefined && this.filters.selectedEditionId + '' !== '-1',
        // this.primengTableHelper.getSorting(this.dataTable),
        undefined,
        this.pageSize,

        (this.pageNumber - 1) * this.pageSize,
      )
      // .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
      .subscribe(result => {
        this.totalItems = result.totalCount;
        this.dataList = result.items;
        this.loading = false;
      }, () => this.loading = false);
  }

  showUserImpersonateLookUpModal(record: any): void {
    this.impersonateUserLookupModal.tenantId = record.id;
    this.impersonateUserLookupModal.shown();
  }

  unlockUser(record: any): void {
    this._tenantService.unlockTenantAdmin(new EntityDtoOfInt64({ id: record.id })).subscribe(() => {
      this.notify.success(this.l('UnlockedTenandAdmin', record.name));
    });
  }

  reloadPage(): void {
    this.getTenants();
    // this.paginator.changePage(this.paginator.getPage());
  }

  createTenant(): void {
    this.createTenantModal.show();
  }

  deleteTenant(tenant: TenantListDto): void {
    this.message.confirm(this.l('TenantDeleteWarningMessage', tenant.tenancyName), this.l('AreYouSure'), isConfirmed => {
      if (isConfirmed) {
        this._tenantService.deleteTenant(tenant.id).subscribe(() => {
          this.reloadPage();
          this.notify.success(this.l('SuccessfullyDeleted'));
        });
      }
    });
  }

  showHistory(tenant: TenantListDto): void {
    this.entityTypeHistoryModal.show({
      entityId: tenant.id.toString(),
      entityTypeFullName: this._entityTypeFullName,
      entityTypeDescription: tenant.tenancyName
    });
  }

  impersonateUser(item: NameValueDto): void {
    this._impersonationService.impersonate(parseInt(item.value, 10), this.impersonateUserLookupModal.tenantId);
  }

  private setIsEntityHistoryEnabled(): void {
    const customSettings = (abp as any).custom;
    this.entityHistoryEnabled =
      customSettings.EntityHistory &&
      customSettings.EntityHistory.isEnabled &&
      _.filter(customSettings.EntityHistory.enabledEntities, entityType => entityType === this._entityTypeFullName).length === 1;
  }
}
