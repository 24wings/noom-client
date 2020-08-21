import { Component, ElementRef, Injector, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TitleService, VERSION as VERSION_ALAIN } from '@delon/theme';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { NzModalService } from 'ng-zorro-antd/modal';
import { VERSION as VERSION_ZORRO } from 'ng-zorro-antd/version';
import { filter } from 'rxjs/operators';
import { MessageExtension } from 'shared/helpers/message.extension';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
})
export class RootComponent implements OnInit {
  constructor(
    private injector: Injector,
    el: ElementRef,
    renderer: Renderer2,
    private router: Router,
    private titleSrv: TitleService, // private modalSrv: NzModalService, // private messageSrv: NzMessageService,
    private notifySrv: NzNotificationService,
  ) {
    // renderer.setAttribute(el.nativeElement, 'ng-alain-version', VERSION_ALAIN.full);
    // renderer.setAttribute(el.nativeElement, 'ng-zorro-version', VERSION_ZORRO.full);
  }

  ngOnInit(): void {
    // 覆盖abp自带的通知和mssage
    // MessageExtension.overrideAbpMessageByMini(
    //   this._messageService,
    //   this._modalService,
    // );

    const modalSrv = this.injector.get(NzModalService);

    //  覆盖abp.message替换为ng-zorro的模态框
    MessageExtension.overrideAbpMessageByNgModal(modalSrv);

    // 覆盖abp.notify替换为ng - zorro的notify
    MessageExtension.overrideAbpNotify(this.notifySrv);

    this.router.events.pipe(filter((evt) => evt instanceof NavigationEnd)).subscribe(() => {
      this.titleSrv.setTitle();
      // this.modalSrv.closeAll();
    });
  }
}
