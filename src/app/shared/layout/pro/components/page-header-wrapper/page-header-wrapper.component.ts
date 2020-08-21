import { ChangeDetectionStrategy, Component, Injector, Input, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '@delon/theme';
import { AlainConfigService, InputBoolean } from '@delon/util';
import { AppComponentBase } from '../../../../../../shared/common/component-base/app-component-base';
import { BrandService } from '../../pro.service';
interface PageHeaderPath {
  title?: string;
  link?: string[];
}

@Component({
  selector: 'page-header-wrapper',
  templateUrl: './page-header-wrapper.component.html',
  host: {
    '[class.alain-pro__page-header-wrapper]': 'true',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProPageHeaderWrapperComponent extends AppComponentBase {
  // #endregion
  paths: PageHeaderPath[] = [];
  public get menus() {
    return this.menuService.getPathByUrl(this.router.url, this.recursiveBreadcrumb);
  }
  constructor(injector: Injector, public pro: BrandService, private router: Router, cog: AlainConfigService, private route: ActivatedRoute, private menuService: MenuService) {
    super(injector);


    cog.attach(this, 'pageHeader', { syncTitle: true });
  }
  // #region page-header fields

  @Input() title: string | TemplateRef<void>;
  @Input() @InputBoolean() loading = false;
  @Input() home: string;
  @Input() homeLink: string;
  @Input() homeI18n: string;

  /**
   * 自动生成导航，以当前路由从主菜单中定位
   */
  @Input() @InputBoolean() autoBreadcrumb = false;
  /**
   * 自动生成标题，以当前路由从主菜单中定位
   */
  @Input() @InputBoolean() autoTitle = true;
  /**
   * 是否自动将标题同步至 `TitleService`、`ReuseService` 下，仅 `title` 为 `string` 类型时有效
   */
  @Input() @InputBoolean() syncTitle = true;
  // @Input() breadcrumb: TemplateRef<void>;
  @Input() logo: TemplateRef<void>;
  @Input() action: TemplateRef<void>;
  @Input() content: TemplateRef<void>;
  @Input() extra: TemplateRef<void>;
  @Input() tab: TemplateRef<void>;
  @Input() phContent: TemplateRef<void>;
  @Input() @InputBoolean() recursiveBreadcrumb: boolean;
  // #endregion

  // #region fields

  @Input() top: TemplateRef<void>;
  @Input() @InputBoolean() noSpacing = false;
  @Input() style: {};

  ngOnInit(): void {
    this.genBreadcrumb();
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.


  }
  private genBreadcrumb() {
    if (!this.autoBreadcrumb || this.menus.length <= 0) {
      this.paths = [];
      return;
    }
    const paths: PageHeaderPath[] = [];
    this.menus.forEach(item => {
      if (typeof item.hideInBreadcrumb !== 'undefined' && item.hideInBreadcrumb) { return; }
      let title = item.text;
      if (item.i18n) { title = this.l(item.i18n); }
      paths.push({ title, link: (item.link && [item.link]) as string[] });
    });
    // add home
    if (this.home) {
      paths.splice(0, 0, {
        title: (this.homeI18n && this.l(this.homeI18n)) || this.home,
        link: [this.homeLink],
      });
    }
    this.paths = paths;
    return this;
  }
}
