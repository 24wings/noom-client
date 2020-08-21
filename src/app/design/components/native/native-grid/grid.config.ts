import { UiProp, WidgetControlType } from '@app/design/meta/ui.prop';

export class GridConfig {
  nzMd?: number;
  nzXs?: number;
  nzSpan?: number;
  nzRow?: boolean;

}
export let gridUiConfig: GridConfig = {
  nzMd: 10
}
export type GridUIConfig = {
  [P in keyof (GridConfig)]?: UiProp
}

export let defaultGridUiOption: GridUIConfig = {
  nzMd: {
    label: '中屏幕栅格宽度',
    type: WidgetControlType.input

  }
}