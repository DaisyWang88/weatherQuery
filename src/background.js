import Setting from './util/setting'
import { WEATHER_CACHE } from './config'
import {
  get,
  post,
  getCurrentCity,
} from './util';
let setting = new Setting();

setting.set([]);



getCurrentCity();



