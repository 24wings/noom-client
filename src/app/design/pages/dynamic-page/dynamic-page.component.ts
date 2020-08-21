import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StableTableMeta } from '@app/design/decorator/stable-table-meta';


@Component({ selector: 'dynamic-page', templateUrl: './dynamic-page.component.html' })
export class DynamicPageComponent implements OnInit {
  constructor(private route: ActivatedRoute, private httpClient: HttpClient) { }
  config: StableTableMeta;
  async ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.config = await this.httpClient.get(`/api/design`, { params: { id } }).toPromise() as any;
  }

}
