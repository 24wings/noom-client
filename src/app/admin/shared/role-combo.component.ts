import { Component, forwardRef, Injector, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppComponentBase } from '@shared/common/component-base';
import { RoleListDto, RoleServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'role-combo',
  template: `
    <nz-select class="form-control" [formControl]="selectedRole">
      <nz-option [nzValue]="">{{ "FilterByRole" | localize }}</nz-option>
      <nz-option *ngFor="let role of roles" [nzValue]="role.id">{{ role.displayName }}</nz-option>
    </nz-select>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RoleComboComponent),
      multi: true
    }
  ]
})
export class RoleComboComponent extends AppComponentBase implements OnInit, ControlValueAccessor {
  roles: RoleListDto[] = [];
  selectedRole = new FormControl('');

  constructor(private _roleService: RoleServiceProxy, injector: Injector) {
    super(injector);
  }

  onTouched: any = () => { };

  ngOnInit(): void {
    this._roleService.getRoles(undefined).subscribe(result => {
      this.roles = result.items;
    });
  }

  writeValue(obj: any): void {
    if (this.selectedRole) {
      this.selectedRole.setValue(obj);
    }
  }

  registerOnChange(fn: any): void {
    this.selectedRole.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.selectedRole.disable();
    } else {
      this.selectedRole.enable();
    }
  }
}
