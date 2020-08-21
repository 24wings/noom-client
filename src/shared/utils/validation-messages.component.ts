import { Component, ElementRef, Input } from '@angular/core';
import { FormControl, NgModel } from '@angular/forms';
import { AppLocalizationService } from '@app/shared/common/localization/app-localization.service';
import * as _ from 'lodash';

class ErrorDef {
  error: string;
  localizationKey: string;
  errorProperty: string;
}

@Component({
  selector: 'validation-messages',
  template: `
    <div class="has-danger" *ngIf="formCtrl.invalid && (formCtrl.dirty || formCtrl.touched)">
      <div *ngFor="let errorDef of errorDefsInternal">
        <div *ngIf="getErrorDefinitionIsInValid(errorDef)" class="form-control-feedback" style="color:red">
          {{ getErrorDefinitionMessage(errorDef) }}
        </div>
      </div>
    </div>
  `
})
export class ValidationMessagesComponent {
  @Input() formCtrl: NgModel;
  readonly standardErrorDefs: ErrorDef[] = [
    { error: 'required', localizationKey: 'ThisFieldIsRequired' } as ErrorDef,
    { error: 'minlength', localizationKey: 'PleaseEnterAtLeastNCharacter', errorProperty: 'requiredLength' } as ErrorDef,
    { error: 'maxlength', localizationKey: 'PleaseEnterNoMoreThanNCharacter', errorProperty: 'requiredLength' } as ErrorDef,
    { error: 'email', localizationKey: 'InvalidEmailAddress' } as ErrorDef,
    { error: 'pattern', localizationKey: 'InvalidPattern', errorProperty: 'requiredPattern' } as ErrorDef
  ];

  constructor(private appLocalizationService: AppLocalizationService) { }

  _errorDefs: ErrorDef[] = [];

  @Input() set errorDefs(value: ErrorDef[]) {
    this._errorDefs = value;
  }

  get errorDefsInternal(): ErrorDef[] {
    const standards = _.filter(this.standardErrorDefs, ed => !_.find(this._errorDefs, edC => edC.error === ed.error));
    return _.concat(standards, this._errorDefs) as ErrorDef[];
  }

  getErrorDefinitionIsInValid(errorDef: ErrorDef): boolean {
    return !!this.formCtrl.errors[errorDef.error];
  }

  getErrorDefinitionMessage(errorDef: ErrorDef): string {
    const errorRequirement = this.formCtrl.errors[errorDef.error][errorDef.errorProperty];
    return !!errorRequirement ? this.appLocalizationService.l(errorDef.localizationKey, errorRequirement) : this.appLocalizationService.l(errorDef.localizationKey);
  }
}
