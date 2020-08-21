import { Component, Input, Injector, ViewChild } from '@angular/core';
import { HttpUtilService } from '@app/shared/services/http-util.service';
import { Topic } from '../entity/Topic';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/component-base';
import { Pickup } from '../entity/pickup';
import { STColumn } from '@delon/abc';
import { CreateOrEditPickupComponent } from './create-or-edit-pickup/create-or-edit-pickup.component';



@Component({ selector: "app-pickup", templateUrl: './pickup.component.html' })
export class PickupComponent extends PagedListingComponentBase<Pickup>{
  @Input() topic: Topic;
  @ViewChild('createOrEditPickup') createOrEditPickup: CreateOrEditPickupComponent

  loading: boolean = false;
  columns: STColumn[] = [
    { index: 'id', title: 'Id' },
    { index: 'pickup_name', title: '取货点' },
    {
      buttons: [
        { title: '编辑', click: (record: any) => this.createOrEditPickup.show(record) }
      ]
    }
  ];

  protected async fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): Promise<void> {
    let data = await this.httpUtil.get("/api/pickup/getAll?topicId=" + this.topic.id).toPromise() as any as {
      result: { items: Pickup[], totalCount: number };
    };
    this.dataList = data.result.items;
    this.totalItems = data.result.totalCount;
  }
  constructor(private httpUtil: HttpUtilService, private injector: Injector) { super(injector); }

  async ngOnInit() {
    this.refresh();

  }
  create() {
    this.createOrEditPickup.show();
  }




}