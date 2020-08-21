import { Component, Input, EventEmitter, Output, Injector } from '@angular/core';
import { Topic } from '@app/admin/entity/Topic';
import { Pickup } from '@app/admin/entity/pickup';
import { AppComponentBase } from '@shared/common/component-base';
import { HttpUtilService } from '@app/shared/services/http-util.service';

@Component({ selector: 'app-create-or-edit-pickup', templateUrl: './create-or-edit-pickup.component.html', styleUrls: ['./create-or-edit-pickup.component.css'] })
export class CreateOrEditPickupComponent extends AppComponentBase {
  active: boolean = false;
  @Input() topic: Topic;
  pickup: Pickup;
  pickupId: number;
  @Output() onSave = new EventEmitter();

  constructor(private injector: Injector, private httpUtil: HttpUtilService) { super(injector); }

  show(pickup?: Pickup) {
    if (pickup) {
      this.pickupId = pickup.id;
      this.pickup = pickup;
    } else {
      this.pickup = new Pickup();
    }
    this.active = true;
  }
  save() {
    this.pickup.topic_id = this.topic.id;
    if (this.pickupId) {
      this.httpUtil.post('/api/pickup/update', this.pickup).toPromise().then(rtn => {
        this.onSave.emit(true);
        this.active = false;
      });
    } else {
      this.httpUtil.post('/api/pickup/create', this.pickup).toPromise().then(rtn => {
        this.onSave.emit(true);
        this.active = false;
      });
    }
  }
  canSubmit() {
    return this.pickup.pickup_name;
  }


}