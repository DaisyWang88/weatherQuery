import chromeSync from './chrome-sync'
import Storage from './storage'
import {
  WEATHER_CACHE,
} from '../config'

const DEFAULT = [];

export default class Setting extends Storage{
  constructor(){
    super(WEATHER_CACHE, DEFAULT)
  }

  get(){
    return  chromeSync.get( this.name ).then( rs =>{
      let setting = this.defaultValue;
      if( rs && Object.keys( rs ).length > 0 ){
        setting = rs[this.name];
      }
      return setting;
    });
  }

  set(value){
    return chromeSync.set( this.name, value);
  }
}