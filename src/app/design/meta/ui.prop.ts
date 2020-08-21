export enum WidgetControlType {
  input = "input",
  textarea = "textarea"
}
export class UiProp {
  field?: string;
  type: WidgetControlType;
  label: string;
  value?: any;
}