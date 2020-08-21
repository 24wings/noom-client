RootModule 负责引导应用程序的加载。

AccountModule 提供登录，注册,第三方登录，密码忘记/重置，电子邮件激活等...它是懒加载。

AppModule 仅用于对应用程序模块进行分组并提供基本布局。它包含几个个子模块：

AdminModule 包含用户管理，角色管理，租户管理，语言管理，设置等页面。它也是懒加载。
MainModule 是开发自己的应用程序的主要模块。它只包含一个可以修改或删除的演示仪表板页面。
WeChatModul 是我们自己开发的用于管理微信公众号授权的模块。它也是懒加载。
我们建议将模块化思想贯彻到底，应用程序划分为更小的模块，就像我们在启动项目中所做的那样，而不是将所有功能添加到主模块中。尽量使用懒加载的形式。

作为基础设施的模块，都应该有自己的路由。例如： AccountModule 的路由规则/account开头（如"/account/login"），AdminModule 的路由规则/app/admin(如"app/admin/users")

Angular 的模块都是基于其 url 加载模块，我们建议启用路由器延迟加载。例如，当您请求以"app/admin"开头的 URL 时，会加载 AdminModule 及其所有组件。如果您不请求这些页面，则不会加载它们。这加快了项目的启动时间（以及让开发调试也更快了，同时他们被独立分割成独立的模块）

除了那些基本模块，还有一些共享模块：

app/app-shared/common/app-shared.module：它作为共享功能的通用模块服务于 main 和 admin 以及 wehcat 模块。
shared/auth/common.module：用于帐户和应用程序模块（及其子模块）使用的通用模块。
shared/utils/utils.module：所有模块（及其子模块）使用的另一个常用模块。我们尝试在这里收集通用代码，即使在不同的应用程序中也可以使用。
shared/service-proxies/service-proxy.module：自动生成的 nswag 代码。它用于与后端 ASP.NET Core API 进行通信。稍后我们将看到“如何生成自动代理”。
构建和配置
Angular 解决方案包含 src/assets/appconfig.dev.json以及src/assets/appconfig.prod.json 文件,它们分为开发环境和生产环境，其中都包含客户端的一些基本设置：

remoteServiceBaseUrl：用于配置服务器端 API 的根地址。默认值：http://localhost:6298
portalBaseUrl：用于配置门户应用程序的根地址。默认值：http://localhost:38772
localeMappings：用于配置与现有本地化不兼容的第三方库的本地化。
uploadApiUrl:用于处理像后端统一上传的路径。默认值："/api/File/Upload"
ngZorroLocaleMappings：用于映射 ngZorro 的本地化配置信息
portalBaseUrl已配置，因为我们使用它来定义 URL 的格式。如果我们想将租户名称用作多租户应用程序的子域名，那么我们可以将appBaseUrl定义为

http://{TENANCY_NAME}.mydomain.com
{TENANCY_NAME}是租户名称的占位符。也可以为 remoteServiceBaseUrl 配置租用名称。要使租赁名称子域正常工作，我们还应在 IIS 的应用程序旁边进行两种配置：

我们应该配置 DNS 以将所有子域名重定向到静态公网 IP 地址。要声明“所有子域名”，我们可以使用\* .mydomain.com 之类的通配符。
我们应该配置 IIS 以将此静态 IP 绑定到我们的应用程序。
至于 LINUX 的玩法，需要配合 Nginx 使用。
在进行多租户开发时，您不需要为租户配置子域名来进行开发， 你可以使用切换租户的功能来进行开发，使用“租户开关”对话框用于在租户之间手动切换。
AppComponentBase
如果从 AppComponentBase 类继承组件，则可以预先注入许多常用服务（如本地化，权限检查器，功能检查器，UI 通知/消息，设置等等）。例如; 你可以在组件类中使用 this.l（...）函数进行本地化。在视图中，您可以使用 localize pipe。请参阅预构建的组件，例如用法。