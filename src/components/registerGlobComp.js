// import { Button } from './Button';
import {
  // Need
  Button,
} from 'vant';
import { BaseBtnWarp } from './Basic';
const compList = [Button, BaseBtnWarp];
export function registerGlobComp(app) {
  compList.forEach((comp) => {
    app.component(comp.name || comp.displayName, comp);
  });
}
