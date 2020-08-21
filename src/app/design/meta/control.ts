import { WidgetControlType } from './ui.prop';

export class ControlBase {
  nzSm?: number;
  nzMd?: number;
  nzRow?: boolean;
  nzXs?: number;
}
export class Control extends ControlBase {
  type: WidgetControlType;

}

export class InputControl extends Control {
  type = WidgetControlType.input;
  nzSm = 12;
  nzMd = 12;
}