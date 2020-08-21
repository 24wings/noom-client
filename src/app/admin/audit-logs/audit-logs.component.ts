import { AfterViewInit, Component, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuditLogDetailModalComponent } from '@app/admin/audit-logs/audit-log-detail-modal.component';
import { EntityChangeDetailModalComponent } from '@app/shared/common/entityHistory/entity-change-detail-modal.component';
import { Table } from '@app/shared/utils/abstract-tree';
import { STColumn, STComponent } from '@delon/abc/st/table';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/component-base';
import { AuditLogListDto, AuditLogServiceProxy, EntityChangeListDto, NameValueDto } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as moment from 'moment';
import { PagedListingComponentBase, PagedRequestDto } from '../../../shared/common/component-base/paged-listing-component-base';


@Component({
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.less'],
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class AuditLogsComponent extends PagedListingComponentBase<AuditLogListDto> implements AfterViewInit {
  loading = false;
  constructor(injector: Injector, private _auditLogService: AuditLogServiceProxy, private _fileDownloadService: FileDownloadService) {
    super(injector);
  }
  columns: STColumn[] = [
    { index: 'checked', type: 'checkbox' },
    { index: 'userName', title: this.l('UserName') },
    { index: 'serviceName', title: this.l('Service') },
    { index: 'methodName', title: this.l('Action') },
    { index: 'Duration', title: this.l('Duration') },
    { index: 'clientIpAddress', title: this.l('IpAddress') },
    { index: 'clientName', title: this.l('Client') },
    { index: 'browserInfo', title: this.l('Browser') },
    { index: 'executionTime', title: this.l('Time') },
    {
      buttons: [
        { tooltip: this.l('Detail'), click: (e: any) => this.showAuditLogDetails(e), icon: 'search', style: { width: 200 } }
      ]

    }

  ];
  isCollapse = true;
  @ViewChild('auditLogDetailModal', { static: true }) auditLogDetailModal: AuditLogDetailModalComponent;
  @ViewChild('entityChangeDetailModal', { static: true }) entityChangeDetailModal: EntityChangeDetailModalComponent;
  @ViewChild('dataTableAuditLogs', { static: true }) dataTableAuditLogs: STComponent;
  @ViewChild('dataTableEntityChanges', { static: true }) dataTableEntityChanges: STComponent;
  // Filters
  public dateRange: Date[] = [moment().startOf('day').toDate(), moment().endOf('day').toDate()];

  public usernameAuditLog: string;
  public usernameEntityChange: string;
  public serviceName: string;
  public methodName: string;
  public browserInfo: string;
  public hasException: boolean = undefined;
  public minExecutionDuration: number;
  public maxExecutionDuration: number;
  public entityTypeFullName: string;
  public objectTypes: NameValueDto[];


  advancedFiltersAreShown = false;

  change(e: {
    pi: number,
    ps: number,
    total: number,
    type: 'pi' | string
  }) {
    if (e.type === 'pi') {
      this.pageNumber = e.pi;
      this.getAuditLogs();
    }

  }
  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }
  resetForm() {

  }
  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {

  }

  ngAfterViewInit(): void {
    // this.primengTableHelper.adjustScroll(this.dataTableAuditLogs);
    // this.primengTableHelper.adjustScroll(this.dataTableEntityChanges);
    this.getAuditLogs();
  }

  showAuditLogDetails(record: AuditLogListDto): void {
    this.auditLogDetailModal.show(record);
  }

  showEntityChangeDetails(record: EntityChangeListDto): void {
    this.entityChangeDetailModal.show(record);
  }

  getAuditLogs(event?) {
    // if (this.primengTableHelperAuditLogs.shouldResetPaging(event)) {
    //   this.paginatorAuditLogs.changePage(0);

    //   return;
    // }

    // this.primengTableHelperAuditLogs.showLoadingIndicator();
    this.loading = true;
    this._auditLogService
      .getAuditLogs(
        this.dateRange[0] ? moment(this.dateRange[0]) : undefined,
        this.dateRange[1] ? moment(this.dateRange[1]).endOf('day') : undefined,
        this.usernameAuditLog ? this.usernameAuditLog : undefined,
        this.serviceName,
        this.methodName,
        this.browserInfo,
        this.hasException,
        this.minExecutionDuration,
        this.maxExecutionDuration,
        this.sorting,
        this.pageSize,
        this.pageSize * (this.pageNumber - 1)
      )
      .subscribe(result => {
        this.totalItems = result.totalCount;
        this.dataList = result.items;
        this.loading = false;
      }, () => this.loading = false);
  }

  getEntityChanges(event?) {
    // this._auditLogService.getEntityHistoryObjectTypes().subscribe(result => {
    //   this.objectTypes = result;
    // });

    // if (this.primengTableHelperEntityChanges.shouldResetPaging(event)) {
    //   this.paginatorEntityChanges.changePage(0);

    //   return;
    // }

    // this.primengTableHelperEntityChanges.showLoadingIndicator();

    // this._auditLogService
    //   .getEntityChanges(
    //     this.dateRange[0],
    //     this.dateRange[1].endOf('day'),
    //     this.usernameEntityChange,
    //     this.entityTypeFullName,
    //     this.primengTableHelperEntityChanges.getSorting(this.dataTableEntityChanges),
    //     this.primengTableHelperEntityChanges.getMaxResultCount(this.paginatorEntityChanges, event),
    //     this.primengTableHelperEntityChanges.getSkipCount(this.paginatorEntityChanges, event)
    //   )
    //   .subscribe(result => {
    //     this.primengTableHelperEntityChanges.totalRecordsCount = result.totalCount;
    //     this.primengTableHelperEntityChanges.records = result.items;
    //     this.primengTableHelperEntityChanges.hideLoadingIndicator();
    //   });
  }

  exportToExcelAuditLogs(): void {
    const self = this;
    self._auditLogService
      .getAuditLogsToExcel(
        this.dateRange[0] ? moment(this.dateRange[0]) : undefined,
        this.dateRange[1] ? moment(this.dateRange[1]).endOf('day') : undefined,
        self.usernameAuditLog,
        self.serviceName,
        self.methodName,
        self.browserInfo,
        self.hasException,
        self.minExecutionDuration,
        self.maxExecutionDuration,
        undefined,
        1,
        0
      )
      .subscribe(result => {
        self._fileDownloadService.downloadTempFile(result);
      });
  }

  exportToExcelEntityChanges(): void {
    const self = this;
    self._auditLogService
      .getEntityChangesToExcel(moment(self.dateRange[0]), moment(self.dateRange[1]).endOf('day'), self.usernameEntityChange, self.entityTypeFullName, undefined, 1, 0)
      .subscribe(result => {
        self._fileDownloadService.downloadTempFile(result);
      });
  }

  truncateStringWithPostfix(text: string, length: number): string {
    return abp.utils.truncateStringWithPostfix(text, length);
  }
}
