import { Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/component-base';
import { ApplicationLanguageEditDto, CreateOrUpdateLanguageInput, LanguageServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'createOrEditLanguageModal',
  templateUrl: './create-or-edit-language-modal.component.html'
})
export class CreateOrEditLanguageModalComponent extends AppComponentBase {
  @ViewChild('languageCombobox', { static: true }) languageCombobox: ElementRef;
  @ViewChild('iconCombobox', { static: true }) iconCombobox: ElementRef;

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  active = false;
  saving = false;

  language: ApplicationLanguageEditDto = new ApplicationLanguageEditDto();
  languageNamesSelectItems: any[] = [];
  flagsSelectItems: any[] = [];

  constructor(injector: Injector, private _languageService: LanguageServiceProxy) {
    super(injector);
  }

  show(languageId?: number): void {
    this.active = true;

    this._languageService.getLanguageForEdit(languageId).subscribe(result => {
      this.language = result.language;

      this.languageNamesSelectItems = _.map(result.languageNames, language => ({
        label: language.displayText,
        value: language.value
      }));

      this.flagsSelectItems = _.map(result.flags, flag => ({
        label: flag.displayText,
        value: flag.value
      }));

      if (!languageId) {
        this.language.isEnabled = true;
      }

    });
  }

  save(): void {
    const input = new CreateOrUpdateLanguageInput();
    input.language = this.language;

    this.saving = true;
    this._languageService
      .createOrUpdateLanguage(input)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.close();
        this.modalSave.emit(null);
      });
  }

  close(): void {
    this.active = false;
  }
}
