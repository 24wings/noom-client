import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/component-base';
import { EditionListDto, EditionServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { PagedListingComponentBase, PagedRequestDto } from '../../../shared/common/component-base/paged-listing-component-base';
import { CreateEditionModalComponent } from './create-edition-modal.component';
import { EditEditionModalComponent } from './edit-edition-modal.component';
import { MoveTenantsToAnotherEditionModalComponent } from './move-tenants-to-another-edition-modal.component';

@Component({
  templateUrl: './editions.component.html',
  animations: [appModuleAnimation()]
})
export class EditionsComponent extends PagedListingComponentBase<EditionListDto> implements OnInit {
  loading = false;
  columns: STColumn[] = [
    { index: 'displayName', title: this.l('EditionName') },
    {
      index: 'dailyPrice', title: this.l('Price'), format: (record) => (record.dailyPrice || record.weeklyPrice || record.monthlyPrice || record.annualPrice) ? ` ${this.appSession.application.currencySign}${record.dailyPrice}${this.l('Daily')}/${this.appSession.application.currencySign}
                        ${record.weeklyPrice}${this.l('Weekly')}/${this.appSession.application.currencySign}${record.monthlyPrice}${this.l('Monthly')} /${this.appSession.application.currencySign} ${record.annualPrice} ${this.l('Annual')}` : ''
    },
    { index: 'trialDayCount', title: this.l('IsTrialActive'), format: (record: any) => `${record.trialDayCount ? this.l('Yes') + record.trialDayCount : this.l('No')}` },
    { index: 'waitingDayAfterExpire', title: this.l('WaitingDayAfterExpire') },
    { index: 'expiringEditionDisplayName', title: this.l('ExpiringEdition') },
    { title: this.l('Action'), buttons: [] }
  ];
  constructor(injector: Injector, private _editionService: EditionServiceProxy) {
    super(injector);
    const actionColumn = this.columns[this.columns.length - 1];
    if (this.permission.isGranted('Pages.Editions.Edit')) {
      actionColumn.buttons.push({
        text: this.l('Edit'),
        click: (record: any) => this.editEditionModal.show(record.id)
      });
    }
    if (this.permission.isGranted('Pages.Editions.Delete')) {
      actionColumn.buttons.push({
        text: this.l('Delete'),
        click: (record: any) => this.deleteEdition(record)
      });
    }
    if (this.permission.isGranted('Pages.Editions.MoveTenantsToAnotherEdition')) {
      actionColumn.buttons.push({
        text: this.l('MoveTenantsToAnotherEdition'),
        click: (record: any) => this.moveTenantsToAnotherEditionModal.show(record.id)
      });
    }
  }

  @ViewChild('createEditionModal', { static: true }) createEditionModal: CreateEditionModalComponent;
  @ViewChild('editEditionModal', { static: true }) editEditionModal: EditEditionModalComponent;
  @ViewChild('moveTenantsToAnotherEditionModal', { static: true }) moveTenantsToAnotherEditionModal: MoveTenantsToAnotherEditionModalComponent;
  @ViewChild('dataTable', { static: true }) dataTable: STComponent;
  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.getEditions();
  }
  ngOnInit() {
    this.getEditions();
  }

  getEditions(): void {
    this.loading = true;
    this._editionService
      .getEditions()
      .subscribe(result => {
        this.totalItems = result.items.length;
        this.dataList = result.items;
        this.loading = false;
      }, () => this.loading = false);
  }

  createEdition(): void {
    this.createEditionModal.show();
  }

  deleteEdition(edition: EditionListDto): void {
    this.message.confirm(this.l('EditionDeleteWarningMessage', edition.displayName), this.l('AreYouSure'), isConfirmed => {
      if (isConfirmed) {
        this._editionService.deleteEdition(edition.id).subscribe(() => {
          this.getEditions();
          this.notify.success(this.l('SuccessfullyDeleted'));
        });
      }
    });
  }
}
