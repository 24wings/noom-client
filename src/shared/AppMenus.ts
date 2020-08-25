import { Menu } from '@delon/theme';

export class AppMenus {
  public static Menus: Menu[] = [
    {
      text: '主导航',
      i18n: 'menu.main',
      group: true,
      hideInBreadcrumb: true,
      children: [
        {
          text: 'Dashboard',
          i18n: 'Dashboard',
          icon: 'anticon anticon-dashboard',
          link: '/app/admin/hostDashboard',
          data: { permission: 'Pages.Administration.Host.Dashboard', }
        },
        {
          text: 'Dynamic-Tenant',
          i18n: 'Dynamic-Tenant',
          icon: 'anticon anticon-dashboard',
          link: '/app/design/dynamic/tenant',
          data: { permission: 'Pages.Administration.Host.Dashboard', }
        },
        {
          text: 'Design',
          i18n: 'Design',
          icon: 'icon-code iconfont',
          link: '/app/design/design',
          data: { permission: 'Pages.Administration.Host.Dashboard', }
        },
        {
          text: 'Dashboard',
          i18n: 'Dashboard',
          icon: 'anticon anticon-dashboard',
          link: '/app/main/dashboard',
          data: { permission: 'Pages.Tenant.Dashboard', }
        },
        {
          text: 'Tenants',
          i18n: 'Tenants',
          icon: 'anticon anticon-dashboard',
          link: '/app/admin/tenants',
          data: { permission: 'Pages.Tenants' }

        },
        {
          text: 'Editions',
          i18n: 'Editions',
          icon: 'anticon anticon-dashboard',
          link: '/app/admin/editions',
          data: { permission: 'Pages.Editions', }

        },
        {
          text: '电商',
          i18n: '电商',
          data: {
            permission: 'Pages.Administration'
          },
          children: [
            {
              text: '社区管理',
              i18n: '社区',
              link: '/app/admin/distribut',
              data: {
                permission: 'Pages.Administration'
              }
            },
            {
              text: '活动管理',
              i18n: '活动管理',
              link: '/app/admin/topic',
              data: {
                permission: 'Pages.Administration'
              }
            },
            {
              text: '取货点',
              i18n: '取货点',
              link: '/app/admin/pickup',
              data: {
                permission: 'Pages.Administration'
              }
            }
          ]
        },
        {
          text: 'Administration',
          i18n: 'Administration',
          icon: 'anticon anticon-dashboard',
          link: '',
          data: { permission: 'Pages.Administration' },
          children: [
            {
              text: 'OrganizationUnits',
              i18n: 'OrganizationUnits',
              icon: 'anticon anticon-dashboard',
              link: '/app/admin/organization-units',
              data: {
                permission: 'Pages.Administration.OrganizationUnits',
              }
            },


            {
              text: 'Roles',
              i18n: 'Roles',
              icon: 'anticon anticon-dashboard',
              link: '/app/admin/roles',
              data: {
                permission: 'Pages.Administration.Roles',
              }
            },
            {
              text: 'Users',
              i18n: 'Users',
              icon: 'anticon anticon-dashboard',
              link: '/app/admin/users',
              data: {
                permission: 'Pages.Administration.Users',
              }
            },
            {
              text: 'Languages',
              i18n: 'Languages',
              icon: 'anticon anticon-dashboard',
              link: '/app/admin/languages',
              data: {
                permission: 'Pages.Administration.Languages',
              }
            },
            {
              text: 'AuditLogs',
              i18n: 'AuditLogs',
              icon: 'anticon anticon-dashboard',
              link: '/app/admin/auditLogs',
              data: {
                permission: 'Pages.Administration.AuditLogs',
              }
            },
            {
              text: 'Maintenance',
              i18n: 'Maintenance',
              icon: 'anticon anticon-dashboard',
              link: '/app/admin/maintenance',
              data: {
                permission: 'Pages.Administration.Maintenance'
              }
            },
            {
              text: 'Maintenance',
              i18n: 'Maintenance',
              icon: 'anticon anticon-dashboard',
              link: '/app/admin/maintenance',
              data: {
                permission: 'Pages.Administration.Host.Maintenance'
              }
            },
            {
              text: 'Subscription',
              i18n: 'Subscription',
              icon: 'anticon anticon-dashboard',
              link: '/app/admin/subscription-management',
              data: {
                permission: 'Pages.Administration.Tenant.SubscriptionManagement',
              }
            },
            // {
            //   text: 'VisualSettings',
            //   i18n: 'VisualSettings',
            //   icon: 'anticon anticon-dashboard',
            //   link: '/app/admin/ui-customization',
            //   data: {
            //     permission: 'Pages.Administration.UiCustomization',
            //   }
            // },
            {
              text: 'Settings',
              i18n: 'Settings',
              icon: 'anticon anticon-dashboard',
              link: '/app/admin/hostSettings',
              data: {
                permission: 'Pages.Administration.Host.Settings',
              }
            },
            {
              text: 'Settings',
              i18n: 'Settings',
              icon: 'anticon anticon-dashboard',
              link: '/app/admin/tenantSettings',
              data: { permission: 'Pages.Administration.Tenant.Sett2ings2' },
            },
          ],
        },
        // {
        //   text: 'DemoUiComponents',
        //   i18n: 'DemoUiComponents',
        //   icon: 'anticon anticon-dashboard',
        //   link: 'Pages.DemoUiComponents',
        //   data: {
        //     permission: 'Pages.DemoUiComponents',
        //   }
        // },
        {
          text: '快捷菜单',
          i18n: 'menu.shortcut',
          icon: 'anticon anticon-rocket',
          shortcutRoot: true,
          children: [],
          data: {

          }
        },
      ],
    },
  ];
}
