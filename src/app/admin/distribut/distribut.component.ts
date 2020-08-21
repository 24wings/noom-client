import { Component, Injector, ViewChild } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/component-base';
import { Distribut } from '../entity/distribut';
import { STColumn, STChange } from '@delon/abc';
import { HttpUtilService } from '@app/shared/services/http-util.service';
import { CreateOrEditDistributComponent } from './create-or-edit-distribut/create-or-edit-distribut.component';

@Component({ selector: 'app-distribut', templateUrl: './distribut.component.html', styleUrls: ['./distribut.component.css'] })
export class DistributComponent extends PagedListingComponentBase<Distribut>{
  @ViewChild('createOrEditDistribut') createOrEditDistribut: CreateOrEditDistributComponent
  loading = false;
  filter = '';
  columns: STColumn[] = [
    { index: 'id', title: 'id', },
    { index: 'shop_name', title: '分布点名称' },
    { index: 'shop_sign', title: '省市区' },
    { index: 'neighbourNum', title: '详细地址' },
    { index: 'nickname', title: '经纬度' },
    { index: 'headPic', title: '供应商', },
    { index: 'headPic', title: '商户名称', },
    { index: 'headPic', title: '创建时间', },
    {
      buttons: [
        {
          text: '编辑', click: (e: any) => this.createOrEditDistribut.show(e)
        }
      ]
    }


  ]

  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.httpUtil.get('/api/distribut/getAll', { skipCount: request.skipCount, maxResultCount: request.maxResultCount, filter: this.filter }).toPromise().then(
      (rtn: any) => {
        this.dataList = rtn.result.items;
        this.totalItems = rtn.result.totalCount;
      }
    )
  }
  constructor(private injector: Injector, private httpUtil: HttpUtilService) { super(injector); }
  ngOnInit() {
    this.refresh();
  }

  click(e: STChange) {
    if (e.type == 'click') {

    } else {
      super.change(e)
    }
  }
  create() {
    this.createOrEditDistribut.show();
  }
} 