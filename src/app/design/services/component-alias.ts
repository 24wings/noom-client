import { CheckboxComponent } from '../components/controlls/checkbox/checkbox.component';
import { DateComponent } from '../components/controlls/date/date.component';
import { TextComponent } from '../components/controlls/text/text.component';
import { defaultGridUiOption, GridConfig, gridUiConfig } from '../components/native/native-grid/grid.config';
import { NativeGridComponent } from '../components/native/native-grid/native-grid.component';
import { inputUIConfig } from '../components/native/native-input/input.config';
import { NativeInputComponent } from '../components/native/native-input/native-input.component';
import { IComponentAlias } from './i-component-alias';

export let ComponentAlias: IComponentAlias = {
  input: {
    defaultConfig: inputUIConfig,
    component: NativeInputComponent
  },
  grid: {
    defaultConfig: defaultGridUiOption,
    component: NativeGridComponent
  },
  text: {
    defaultConfig: {},
    component: TextComponent
  },
  checkbox: {
    defaultConfig: {},
    component: CheckboxComponent
  },
  date: {
    defaultConfig: {},
    component: DateComponent
  }

};
