// import { Button } from './Button';
import {
  // Need
  Button as VantButton,

} from 'vant';

const compList = [VantButton];

export function registerGlobComp(app) {
  compList.forEach((comp) => {
    app.component(comp.name || comp.displayName, comp);
  });

}
