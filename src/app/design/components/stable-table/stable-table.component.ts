import { HttpClient } from '@angular/common/http';
import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { StableButton, StableTableMeta } from '@app/design/decorator/stable-table-meta';
import { STColumn } from '@delon/abc/st';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/component-base';
import { DynamicEditFormComponent } from '../dynamic-edit-form/dynamic-edit-form.component';

@Component({
  selector: 'app-stable-table',
  templateUrl: './stable-table.component.html'
})
export class StableTableComponent extends PagedListingComponentBase<any> implements OnInit {
  @ViewChild('appDynamicEditForm') appDynamicEditForm: DynamicEditFormComponent;
  constructor(private injector: Injector, private httpClient: HttpClient) {
    super(injector);
  }

  @Input() config: StableTableMeta;
  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.httpClient.get(this.config.loadUrl, {
      params: {
        MaxResultCount: request.maxResultCount + '',
        SkipCount: request.skipCount + ''

      }
    }).toPromise().then((rtn: any) => {
      this.dataList = rtn.result.items;
      this.totalItems = rtn.result.totalCount;
    });
  }
  ngOnInit() {
    this.refresh();
  }

  doAction(b: StableButton) {
    switch (b.action) {
      case 'create':
        this.loadConfig(b.id).then(config => {
          this.appDynamicEditForm.shown(config as any);
        });
        break;

      default:
        break;
    }
  }

  loadConfig(id: string) {
    return this.httpClient.get('/api/design?id=' + id).toPromise();

  }
}
