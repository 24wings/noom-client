import { UIComponent } from '../components/ui.component';

export interface IComponentAlias {
  [p: string]: {
    defaultConfig: any,
    component: new () => UIComponent
  };
}