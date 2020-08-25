export type IifCondition = string | number | boolean | { gt: any };
export type Iif<T> = { [p in keyof T]?: IifCondition };

export class StableEditFormItem<T> {
  label: string;
  iif?: Iif<T>[];

}

export class StableEditFormMeta<T> {
  loadUrl: string;
  formItems: StableEditFormItem<T>[];
  submitUrl: string;

}
