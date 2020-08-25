import { Component, ComponentFactoryResolver, Input, ViewChild, OnInit } from '@angular/core';
import { DynamicDirective } from '@app/design/directives/dynamic-directive';
import { ActionLogService } from '@app/design/services/action-log.service';
import { ComponentAlias } from '@app/design/services/component-alias';
import { UIComponent } from '../ui.component';

@Component({ selector: 'dynamic-component', templateUrl: './dynamic-component.html' })
export class DynamicComponent implements OnInit {
  @ViewChild(DynamicDirective, { static: true }) adHost: DynamicDirective;
  @Input() isActive = false;
  @Input() alias: string;
  @Input() config: any;
  constructor(private componentFactoryResolver: ComponentFactoryResolver, private actionLogService: ActionLogService) { }
  componentRef: { instance: UIComponent };
  ngOnInit() {
    this.loadComponent();
  }

  loadComponent() {

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ComponentAlias[this.alias].component);

    const viewContainerRef = this.adHost.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory) as any;
    this.componentRef.instance.config = Object.assign({}, ComponentAlias[this.alias].defaultConfig, this.config);
  }
  showEditConfigModal(e: MouseEvent) {
    e.preventDefault();

    e.stopPropagation();


  }
  log() {
    this.actionLogService.send('save config ');
  }
}
