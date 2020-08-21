import { RefreshTokenService } from "@abp/abpHttpInterceptor";
import { Injectable } from "@angular/core";
import { AppConsts } from "@shared/AppConsts";
import { RefreshTokenResult, TokenAuthServiceProxy } from "@shared/service-proxies/service-proxies";
import { TokenService } from "abp-ng2-module/dist/src/auth/token.service";
import { UtilsService } from "abp-ng2-module/dist/src/utils/utils.service";
import { Observable, of, Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ZeroRefreshTokenService implements RefreshTokenService {
  constructor(private _tokenAuthService: TokenAuthServiceProxy, private _tokenService: TokenService, private _utilsService: UtilsService) {}

  tryAuthWithRefreshToken(): Observable<boolean> {
    const refreshTokenObservable = new Subject<boolean>();

    const token = this._tokenService.getRefreshToken();
    if (!token || token.trim() === "") {
      return of(false);
    }

    this._tokenAuthService.refreshToken(token).subscribe(
      (tokenResult: RefreshTokenResult) => {
        if (tokenResult && tokenResult.accessToken) {
          const tokenExpireDate = new Date(new Date().getTime() + 1000 * tokenResult.expireInSeconds);
          this._tokenService.setToken(tokenResult.accessToken, tokenExpireDate);

          this._utilsService.setCookieValue(AppConsts.authorization.encryptedAuthTokenName, tokenResult.encryptedAccessToken, tokenExpireDate, abp.appPath);

          refreshTokenObservable.next(true);
        } else {
          refreshTokenObservable.next(false);
        }
      },
      (error: any) => {
        refreshTokenObservable.next(false);
      }
    );
    return refreshTokenObservable;
  }
}
