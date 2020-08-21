import { Component, Injector, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/component-base';
import { Topic } from '@app/admin/entity/Topic';
import { HttpUtilService } from '@app/shared/services/http-util.service';
import { NzCascaderOption } from 'ng-zorro-antd';

@Component({ selector: "app-create-or-edit-topic", templateUrl: './create-or-edit-topic.component.html', styleUrls: ['./create-or-edit-topic.component.css'] })
export class CreateOrEditTopicComponent extends AppComponentBase {
  topic: Topic = new Topic()
  active: boolean = false;
  options: NzCascaderOption[] = []
  @Output() modalSave = new EventEmitter();
  addressList = [];
  id: number;



  constructor(injector: Injector, private httpUtil: HttpUtilService) { super(injector) }

  save() {

    this.topic.province = this.addressList[0];
    this.topic.city = this.addressList[1];
    this.topic.area = this.addressList[2];
    delete this.topic['_values']
    debugger;
    if (this.id) {
      this.httpUtil.post('/api/topic/update', this.topic).toPromise()
        .then(() => {
          this.modalSave.emit(true);
          this.active = false;
        });
    } else {
      this.httpUtil.post('/api/topic/create', this.topic).toPromise()
        .then(() => {
          this.modalSave.emit(true);
          this.active = false;
        });

    }


  }
  get canSubmit() {
    if (this.addressList.length < 3) {
      return false;
    }
    if (!this.topic.name) {
      return false;
    }
    return true;
  }
  show(topic?: Topic) {
    debugger;
    if (topic) {
      this.id = topic.id;
      this.topic = topic;
      this.addressList = [topic.province, topic.city, topic.area];

    } else {
      this.topic = new Topic();
    }
    this.active = true;
    this.loadCityData();
  }
  async loadCityData() {
    let data = await this.httpUtil.get('/assets/citys.json').toPromise() as { label: string, value: string, name: string, title: string; children, city: { label: string, name: string, title: string, value: string, area: string[], children }[] }[];
    this.options = data.map(province => {
      province.title = province.name;
      province.label = province.name;
      province.value = province.name;
      province.children = province.city.map(city => {

        city.children = city.area.map(area => { return { title: area, label: area, value: area, isLeaf: true } });
        city.title = city.name;
        city.label = city.name;
        city.value = city.name;
        return city

      });

      return province;
    })

  }

}