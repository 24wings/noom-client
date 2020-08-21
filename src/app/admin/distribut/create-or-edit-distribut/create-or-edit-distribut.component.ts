import { Component, Injector, Output, EventEmitter } from '@angular/core';
import { AppComponentBase } from '@shared/common/component-base';
import { HttpUtilService } from '@app/shared/services/http-util.service';
import { Distribut } from '@app/admin/entity/distribut';

@Component({ selector: "app-create-or-edit-distribut", templateUrl: './create-or-edit-distribut.component.html', styleUrls: ['./create-or-edit-distribut.component.css'] })
export class CreateOrEditDistributComponent extends AppComponentBase {
  distribut: Distribut
  active: boolean = false;
  @Output() modalSave = new EventEmitter();
  constructor(private httpUtil: HttpUtilService, private injector: Injector) { super(injector); }

  show(distribut?: Distribut) {
    if (distribut) {
      this.distribut = distribut;
    } else {
      this.distribut = new Distribut();
    }
    this.active = true;
  }

  save() {
    // 更新
    if (this.distribut.id) {
      this.httpUtil.post('/api/distribut/update', this.distribut).toPromise()
        .then(rtn => {
          this.modalSave.emit(true);
          this.active = false;
        })

    }
    // 新增
    else {
      this.httpUtil.post('/api/distribut/insert', this.distribut).toPromise().then(rtn => {
        this.modalSave.emit(true);
        this.active = false;
      })

    }


  }
  canSubmit(): boolean {
    if (this.distribut) {
      if (this.distribut.shop_name && this.distribut.neighbourNum && this.distribut.nickname && this.distribut.shop_sign) {
        return true;
      }
      return false;

    } else {
      return false;
    }

  }




}