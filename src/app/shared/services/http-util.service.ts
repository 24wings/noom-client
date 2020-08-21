import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HttpUtilService {
  ip: string = "http://localhost:4200"
  constructor(private httpClient: HttpClient) { }

  get(url: string, params?: any) {
    const customHeaders = {
      Authorization: 'Bearer ' + abp.auth.getToken()
    } as any;
    return this.httpClient.get(url, { headers: customHeaders, params: params });
  }

  post(url: string, data: any, params?: any) {
    const customHeaders = {
      Authorization: 'Bearer ' + abp.auth.getToken()
    } as any;
    return this.httpClient.post(url, data, { headers: customHeaders, params: params });
  }

}