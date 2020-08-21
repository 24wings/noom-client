import { UiProp, WidgetControlType } from '@app/design/meta/ui.prop';

export class InputConfig {
  nzPlaceHolder: string;
  label: string;

}
export type InputUIConfig = {
  [P in keyof (InputConfig)]?: UiProp
}

export let inputUIConfig: InputUIConfig = {
  nzPlaceHolder: {
    label: '悬浮提示',
    type: WidgetControlType.input,
  },
  label: {
    label: 'label',
    type: WidgetControlType.input,
  }
}