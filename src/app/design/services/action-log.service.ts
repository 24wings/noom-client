import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class ActionLogService {
  private subject = new Subject<any>();

  send(message: any) {
    this.subject.next(message);
  }

  get(): Observable<any> {
    return this.subject.asObservable();
  }
}