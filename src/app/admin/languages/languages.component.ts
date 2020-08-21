import { AbpSessionService } from '@abp/session/abp-session.service';
import { Component, ElementRef, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn, STColumnYn, STComponent } from '@delon/abc/st/table';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/component-base';
import { ApplicationLanguageListDto, LanguageServiceProxy, SetDefaultLanguageInput } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { PagedListingComponentBase, PagedRequestDto } from '../../../shared/common/component-base/paged-listing-component-base';
import { CreateOrEditLanguageModalComponent } from './create-or-edit-language-modal.component';

@Component({
  templateUrl: './languages.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [appModuleAnimation()]
})
export class LanguagesComponent extends PagedListingComponentBase<ApplicationLanguageListDto> {
  loading = false;
  ynColumn: STColumnYn = {

    yes: '禁用',
    no: '启用',
    mode: 'text'
  };
  columns: STColumn[] = [
    { type: 'checkbox', index: 'checked' },
    { title: this.l('Name'), index: 'displayName' },
    { title: this.l('Code'), index: 'name' },
    { title: this.l('IsEnabled'), index: 'isDisabled', type: 'yn', yn: this.ynColumn },
    {
      title: this.l('Actions'),
      buttons: []
    }
  ];
  constructor(injector: Injector, private _languageService: LanguageServiceProxy, private _sessionService: AbpSessionService, private _router: Router) {
    super(injector);
    const buttonsColumn = this.columns[this.columns.length - 1];
    if (this.permission.isGranted('Pages.Administration.Languages.Edit')) {
      buttonsColumn.buttons.push({
        text: this.l('Edit'),
        click: (record) => this.createOrEditLanguageModal.show(record.id)
      });
    }
    //   <a (click)="changeTexts(record)" *ngIf="'Pages.Administration.Languages.ChangeTexts' | permission" href="javascript:">{{ "ChangeTexts" | localize }}</a>
    if (this.permission.isGranted('Pages.Administration.Languages.ChangeTexts')) {
      buttonsColumn.buttons.push({
        text: this.l('ChangeTexts'),
        click: (record: any) => this.changeTexts(record)
      });
    }
    // (click)="setAsDefaultLanguage(record)" *ngIf="'Pages.Administration.Languages.Edit'
    if (this.permission.isGranted('Pages.Administration.Languages.Edit')) {
      buttonsColumn.buttons.push({
        text: this.l('SetAsDefaultLanguage'),
        click: (record: any) => this.setAsDefaultLanguage(record)
      });
    }
    // <a(click) = "deleteLanguage(record)"* ngIf="('Pages.Administration.Languages.Delete' | permission) && record.tenantId === appSession.tenantId"href = "javascript:"> {{ "Delete" | localize }}</a>
    if (this.permission.isGranted('Pages.Administration.Languages.Delete')) {
      buttonsColumn.buttons.push({
        text: this.l('Delete'),
        click: (record: any) => this.deleteLanguage(record)
      });
    }

  }

  get multiTenancySideIsHost(): boolean {
    return !this._sessionService.tenantId;
  }
  @ViewChild('languagesTable', { static: true }) languagesTable: ElementRef;
  @ViewChild('createOrEditLanguageModal', { static: true }) createOrEditLanguageModal: CreateOrEditLanguageModalComponent;
  @ViewChild('dataTable', { static: true }) dataTable: STComponent;


  defaultLanguageName: string;
  filterText;
  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.getLanguages();
  }
  getSelectedItems() {
    return this.dataList.filter((item: any) => item.checked).length;
  }
  getLanguages(): void {
    // this.primengTableHelper.showLoadingIndicator();
    this.loading = true;
    this._languageService
      .getLanguages()
      .subscribe(result => {
        this.defaultLanguageName = result.defaultLanguageName;
        this.dataList = result.items;
        this.totalItems = result.items.length;
        this.loading = false;
      }, () => this.loading = false);
  }

  changeTexts(language: ApplicationLanguageListDto): void {
    debugger;
    this._router.navigate(['app/admin/languages', language.name, 'texts']);
  }

  setAsDefaultLanguage(language: ApplicationLanguageListDto): void {
    const input = new SetDefaultLanguageInput();
    input.name = language.name;
    this._languageService.setDefaultLanguage(input).subscribe(() => {
      this.getLanguages();
      this.notify.success(this.l('SuccessfullySaved'));
    });
  }

  deleteLanguage(language: ApplicationLanguageListDto): void {
    this.message.confirm(this.l('LanguageDeleteWarningMessage', language.displayName), this.l('AreYouSure'), isConfirmed => {
      if (isConfirmed) {
        this._languageService.deleteLanguage(language.id).subscribe(() => {
          this.getLanguages();
          this.notify.success(this.l('SuccessfullyDeleted'));
        });
      }
    });
  }

  deleteLanguageBat() {

  }
}
