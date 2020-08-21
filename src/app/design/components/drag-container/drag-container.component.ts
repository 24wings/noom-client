import { Component, Input, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { DynamicDirective } from '@app/design/directives/dynamic-directive';
import { UIComponent } from '../ui.component';
import { ComponentAlias } from '@app/design/services/component-alias';
import { ConfigModalComponent } from '../config-modal/config-modal.component';
import { ActionLogService } from '@app/design/services/action-log.service';

@Component({
  selector: 'drag-cotainer',
  templateUrl: './drag-container.component.html',
  styleUrls: ['./drag-container.component.css']
})
export class DragContainerComponent {
  @ViewChild(DynamicDirective, { static: true }) adHost: DynamicDirective;
  @Input() isActive: boolean = false;
  @Input() alias: string;
  @Input() config: any;
  @ViewChild(ConfigModalComponent) configModalComponent: ConfigModalComponent;
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
    this.configModalComponent.shown(Object.keys(ComponentAlias[this.alias].defaultConfig).map(k => {
      ComponentAlias[this.alias].defaultConfig[k].value = this.config[k];
      ComponentAlias[this.alias].defaultConfig[k].field = k;
      return ComponentAlias[this.alias].defaultConfig[k];
    }
    ));

  }
  log() {
    this.actionLogService.send('save config ')
  }

}