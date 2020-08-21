import { STColumn } from '@delon/abc/st';

export class StableButton {
  text: string;
  action: 'create' | 'update' | 'custom';
  type: string;
  id?: string;
}

export class StableTableMeta {
  loadUrl: string;
  columns: STColumn[];
  buttons: StableButton[];

}


