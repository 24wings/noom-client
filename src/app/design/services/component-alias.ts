import { NativeInputComponent } from '../components/native/native-input/native-input.component';
import { inputUIConfig } from '../components/native/native-input/input.config';
import { IComponentAlias } from './i-component-alias';
import { GridConfig, gridUiConfig, defaultGridUiOption } from '../components/native/native-grid/grid.config';
import { NativeGridComponent } from '../components/native/native-grid/native-grid.component';

export let ComponentAlias: IComponentAlias = {
  input: {
    defaultConfig: inputUIConfig,
    component: NativeInputComponent
  },
  grid: {
    defaultConfig: defaultGridUiOption,
    component: NativeGridComponent
  }

}