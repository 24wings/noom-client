import { Component, Injector, ViewChild, Output } from '@angular/core';
import { HttpUtilService } from '@app/shared/services/http-util.service';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/component-base';
import { Topic } from '../entity/Topic';
import { STColumn, STChange } from '@delon/abc';
import { CreateOrEditTopicComponent } from './create-or-edit-topic/create-or-edit-topic.component';
import { EventEmitter } from 'events';

@Component({ selector: "app-topic", templateUrl: './topic.component.html', styleUrls: ['./topic.component.css'] })
export class TopicComponent extends PagedListingComponentBase<Topic> {
  @ViewChild('createOrEditTopic') createOrEditTopic: CreateOrEditTopicComponent;
  loading = false;
  selectedTopic: Topic;
  columns: STColumn[] = [
    { index: 'id', title: 'Id' },
    { index: 'name', title: '社区名称' },
    {
      index: 'data', title: '地址信息', format: (item) => `${item.province}-${item.city}-${item.area}`
    },
    {
      buttons: [
        { text: '编辑', click: (e: any) => this.createOrEditTopic.show(e) }
      ]
    }
  ]

  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.loading = true;
    this.httpUtil.get('/api/topic/getAll', { ...request }).toPromise().then((rtn: { result: { items: Topic[], totalCount: number } }) => {
      this.totalItems = rtn.result.totalCount;
      this.dataList = rtn.result.items;
      this.loading = false;
    });
  }

  constructor(private httpUtil: HttpUtilService, private injector: Injector) {
    super(injector);
  }
  ngOnInit() {
    this.fetchDataList({ skipCount: 0, maxResultCount: 10, sorting: '' }, 0, null);
  }


  create() {
    this.createOrEditTopic.show();

  }
  click(e: STChange) {
    if (e.type == 'click') {
      this.selectedTopic = null;
      setTimeout(() => {
        this.selectedTopic = e.click.item as any;
      }, 200);


    } else {
      super.change(e);
    }


  }










}