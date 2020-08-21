import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';

import { NameValueDto, PagedResultDtoOfNameValueDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';

import { STColumn } from '@delon/abc/st/table';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '../component-base';
import { PagedListingComponentBase, PagedRequestDto } from '../component-base/paged-listing-component-base';

export interface ICommonLookupModalOptions {
  title?: string;
  isFilterEnabled?: boolean;
  dataSource: (skipCount: number, maxResultCount: number, filter: string, tenantId?: number) => Observable<PagedResultDtoOfNameValueDto>;
  canSelect?: (item: NameValueDto) => boolean | Observable<boolean>;
  loadOnStartup?: boolean;
  pageSize?: number;
}

// For more modal options http://valor-software.com/ngx-bootstrap/#/modals#modal-directive

@Component({
  selector: 'commonLookupModal',
  templateUrl: './common-lookup-modal.component.html'
})
export class CommonLookupModalComponent extends PagedListingComponentBase<NameValueDto> {
  constructor(injector: Injector) {
    super(injector);
  }
  static defaultOptions: ICommonLookupModalOptions = {
    dataSource: undefined,
    canSelect: () => true,
    loadOnStartup: true,
    isFilterEnabled: true,
    pageSize: AppConsts.grid.defaultPageSize
  };
  columns: STColumn[] = [
    {
      buttons: [
        { text: this.l('Select'), click: (e: any) => this.selectItem(e) }
      ]
    },
    { title: this.l('Name'), index: 'name' }

  ];

  @Output() itemSelected: EventEmitter<NameValueDto> = new EventEmitter<NameValueDto>();

  // @ViewChild('modal', { static: true }) modal: ModalDirective;
  // @ViewChild('dataTable', { static: true }) dataTable: Table;
  // @ViewChild('paginator', { static: true }) paginator: Paginator;

  options: ICommonLookupModalOptions = _.merge({});
  active = false;
  isShown = false;
  isInitialized = false;
  filterText = '';
  tenantId?: number;
  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
  }

  configure(options: ICommonLookupModalOptions): void {
    this.options = _.merge({}, CommonLookupModalComponent.defaultOptions, { title: this.l('SelectAnItem') }, options);
  }


  refreshTable(): void {
    // this.paginator.changePage(this.paginator.getPage());
  }

  close(): void {
    // this.modal.hide();
  }

  shown(): void {
    this.isShown = true;
    this.getRecordsIfNeeds(null);
    this.active = true;

  }

  getRecordsIfNeeds(event?): void {
    if (!this.isShown) {
      return;
    }

    if (!this.options.loadOnStartup && !this.isInitialized) {
      return;
    }

    this.getRecords(event);
    this.isInitialized = true;
  }

  getRecords(event?): void {
    // const maxResultCount = this.primengTableHelper.getMaxResultCount(this.paginator, event);
    // const skipCount = this.primengTableHelper.getSkipCount(this.paginator, event);
    // if (this.primengTableHelper.shouldResetPaging(event)) {
    //   this.paginator.changePage(0);

    //   return;
    // }

    // this.primengTableHelper.showLoadingIndicator();

    this.options
      .dataSource((this.pageNumber - 1) * this.pageSize, this.pageSize, this.filterText, this.tenantId)
      .subscribe(result => {
        this.totalItems = result.totalCount;
        this.dataList = result.items;
      });
  }

  selectItem(item: NameValueDto) {
    const boolOrPromise = this.options.canSelect(item);
    if (!boolOrPromise) {
      return;
    }

    if (boolOrPromise === true) {
      this.itemSelected.emit(item);
      this.close();
      return;
    }

    // assume as observable
    (boolOrPromise as Observable<boolean>).subscribe(result => {
      if (result) {
        this.itemSelected.emit(item);
        this.close();
      }
    });
  }

}
