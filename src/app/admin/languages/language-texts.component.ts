import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Table } from '@app/shared/utils/abstract-tree';
import { STChange, STColumn, STComponent } from '@delon/abc/st/table';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/component-base';
import { LanguageServiceProxy, LanguageTextListDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { PagedListingComponentBase, PagedRequestDto } from '../../../shared/common/component-base/paged-listing-component-base';
import { EditTextModalComponent } from './edit-text-modal.component';

@Component({
  templateUrl: './language-texts.component.html',
  styleUrls: ['./language-texts.component.less'],
  animations: [appModuleAnimation()]
})
export class LanguageTextsComponent extends PagedListingComponentBase<LanguageTextListDto> implements AfterViewInit, OnInit {
  loading = false;
  // @ViewChild('baseLanguageName') baseLanguageName:
  columns: STColumn[] = [
    { type: 'checkbox', index: 'checked', title: this.l('Selection') },
    { index: 'key', title: this.l('Key') },
    { index: 'baseValue', title: this.l('BaseValue') },
    { index: 'targetValue', title: this.l('TargetValue') },
    { title: this.l('Actions'), buttons: [] }
  ];
  constructor(injector: Injector, private _languageService: LanguageServiceProxy, private _router: Router, private _activatedRoute: ActivatedRoute) {
    super(injector);
    const actionColumn = this.columns[this.columns.length - 1];
    actionColumn.buttons.push({
      text: this.l('Edit'),
      click: (record: any) => this.editTextModal.show(this.baseLanguageName, this.targetLanguageName, this.sourceName, record.key, record.baseValue, record.targetValue)
    });
  }
  @ViewChild('targetLanguageNameCombobox', { static: true }) targetLanguageNameCombobox: ElementRef;
  @ViewChild('baseLanguageNameCombobox', { static: true }) baseLanguageNameCombobox: ElementRef;
  @ViewChild('sourceNameCombobox', { static: true }) sourceNameCombobox: ElementRef;
  @ViewChild('targetValueFilterCombobox', { static: true }) targetValueFilterCombobox: ElementRef;
  @ViewChild('textsTable', { static: true }) textsTable: ElementRef;
  @ViewChild('editTextModal', { static: true }) editTextModal: EditTextModalComponent;
  @ViewChild('dataTable', { static: true }) dataTable: STComponent;


  sourceNames: string[] = [];
  languages: abp.localization.ILanguageInfo[] = [];
  targetLanguageName: string;
  sourceName: string;
  baseLanguageName: string;
  targetValueFilter: string;
  filterText: string;
  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {

    this.getLanguageTexts();
  }

  ngOnInit(): void {
    this.sourceNames = _.map(
      _.filter(abp.localization.sources, source => source.type === 'MultiTenantLocalizationSource'),
      value => value.name
    );
    this.languages = abp.localization.languages;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.init();
    });
  }

  getLanguageTexts(event?) {
    // if (!this.paginator || !this.dataTable || !this.sourceName) {
    //   return;
    // }

    // this.primengTableHelper.showLoadingIndicator();
    this.loading = true;
    this._languageService
      .getLanguageTexts(
        this.sourceName,
        this.baseLanguageName,
        this.targetLanguageName,
        this.targetValueFilter,
        this.filterText ? this.filterText : undefined,
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

  init(): void {
    this._activatedRoute.params.subscribe((params: Params) => {
      this.baseLanguageName = params.baseLanguageName || abp.localization.currentLanguage.name;
      this.targetLanguageName = params.name;
      this.sourceName = params.sourceName || 'eShopLinker';
      this.targetValueFilter = params.targetValueFilter || 'ALL';
      this.filterText = params.filterText || '';

      this.reloadPage();
    });
  }
  pageChange(e: STChange) {
    if (e.type === 'pi') {
      this.pageNumber = e.pi;
      this.getLanguageTexts();
    }

  }

  reloadPage(): void {
    // this.paginator.changePage(this.paginator.getPage());
    this.getLanguageTexts();
  }

  applyFilters(): void {
    this._router.navigate([
      'app/admin/languages',
      this.targetLanguageName,
      'texts',
      {
        sourceName: this.sourceName,
        baseLanguageName: this.baseLanguageName,
        targetValueFilter: this.targetValueFilter,
        filterText: this.filterText
      }
    ]);

    // if (this.paginator.getPage() !== 0) {
    //   this.paginator.changePage(0);

    //   return;
    // }
  }

  truncateString(text): string {
    return abp.utils.truncateStringWithPostfix(text, 32, '...');
  }

  refreshTextValueFromModal(): void {
    // for (const record of this.dataList) {
    //   if (record.key === this.editTextModal.model.key) {
    //     record.targetValue = this.editTextModal.model.value;
    //     return;
    //   }
    // }
    this.reloadPage();

  }
}
