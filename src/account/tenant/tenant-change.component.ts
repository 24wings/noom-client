import { Component, Injector, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { AppComponentBase } from '@shared/common/component-base/app-component-base';
import { TenantChangeModalComponent } from './tenant-change-modal.component';

@Component({
  selector: 'app-tenant-change',
  templateUrl: './tenant-change.component.html',
})
export class TenantChangeComponent extends AppComponentBase implements OnInit {
  tenancyName: string;
  name: string;

  constructor(injector: Injector) {
    super(injector);
  }

  get isMultiTenancyEnabled(): boolean {
    return abp.multiTenancy.isEnabled;
  }

  ngOnInit() {
    if (this.appSession?.tenant) {
      this.tenancyName = this.appSession.tenant.tenancyName;
      this.name = this.appSession.tenant.name;
    }
  }

  showChangeModal(): void {
    this.modalHelper.open(TenantChangeModalComponent, { tenancyName: this.tenancyName }, 'md').subscribe((res) => {
      if (res) {
        window.location.reload();
      }
    });
  }
}
