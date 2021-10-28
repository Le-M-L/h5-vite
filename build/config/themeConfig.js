import { generate } from '@ant-design/colors';


export function generateAntColors(color, theme = 'default') {
    return generate(color, {
      theme,
    });
  }
  



export const primaryColor = '#0960bd';