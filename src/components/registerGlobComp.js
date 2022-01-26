// import { Button } from './Button';
import {
  // Need
  Button as VantButton,
} from 'vant';
import { BaseBtnWarp } from './Basic';
const compList = [VantButton, BaseBtnWarp];

export function registerGlobComp(app) {
  compList.forEach((comp) => {
    app.component(comp.name || comp.displayName, comp);
  });
}
