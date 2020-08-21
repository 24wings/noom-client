// import { UtilsService } from "@abp/utils/utils.service";
// import { AppConsts } from "@shared/AppConsts";

// export class SignalRHelper {
//   static initSignalR(callback: () => void): void {
//     const encryptedAuthToken = new UtilsService().getCookieValue(AppConsts.authorization.encryptedAuthTokenName);

//     abp.signalr = {
//       autoConnect: false, // _zone.runOutsideAngular in ChatSignalrService
//       // autoReconnect: true,
//       connect: undefined,
//       hubs: undefined,
//       qs: AppConsts.authorization.encryptedAuthTokenName + "=" + encodeURIComponent(encryptedAuthToken),
//       remoteServiceBaseUrl: AppConsts.remoteServiceBaseUrl,
//       startConnection: undefined,
//       url: "/signalr"
//     };

//     const script = document.createElement("script");
//     script.onload = () => {
//       callback();
//     };

//     script.src = AppConsts.appBaseUrl + "/assets/abp/abp.signalr-client.js";
//     document.head.appendChild(script);
//   }
// }
