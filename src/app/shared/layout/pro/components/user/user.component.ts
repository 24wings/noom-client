import { ChangeDetectionStrategy, Component, Inject, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { SettingsService } from '@delon/theme';
import { AppComponentBase } from '../../../../../../shared/common/component-base/app-component-base';
import { AppAuthService } from '../../../../common/auth/app-auth.service';

@Component({
  selector: 'layout-pro-user',
  templateUrl: './user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutProWidgetUserComponent extends AppComponentBase implements OnInit {
  constructor(
    injector: Injector,
    public settings: SettingsService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private authService: AppAuthService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    // mock
    const token = this.tokenService.get() || {
      token: 'nothing',
      name: 'Admin',
      avatar: './assets/logo-color.svg',
      email: 'cipchk@qq.com',
    };
    this.tokenService.set(token);
  }
  onMySettingsModalSaved(): void {
    abp.event.trigger('app.onMySettingsModalSaved');
  }
  logout() {
    this.authService.logout(true, '/');
    // this.tokenService.clear();
    // this.router.navigateByUrl(this.tokenService.login_url);
  }
}
