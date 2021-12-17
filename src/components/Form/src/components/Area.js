/**
 * 省市区
 */
export default class Area {
  /**
   * 构造器
   * @param express
   */
  constructor(pcaa) {
    let arr = [];
    let treeData = {
      province_list:{},
      city_list:{},
      county_list:{}
    };
    const province = pcaa['86'];
    
    Object.keys(province).map((key) => {
      treeData.province_list[key] = province[key];
      arr.push({ id: key, text: province[key], pid: '86', index: 1 });
      const city = pcaa[key];
      Object.keys(city).map((key2) => {
      treeData.city_list[key2] = city[key2];
      arr.push({ id: key2, text: city[key2], pid: key, index: 2 });
        const qu = pcaa[key2];
        if (qu) {
          Object.keys(qu).map((key3) => {
            treeData.county_list[key3] = qu[key3];
            arr.push({ id: key3, text: qu[key3], pid: key2, index: 3 });
          });
        }
      });
    });
    this.all = arr;
    this.treeData = treeData;
  }

  get pca() {
    return this.all;
  }

  getCode(code) {
    if (!code || code.length == 0) {
      return '';
    }
    for(let item of this.all){
        if(item.text === code)  return item.id;
    }
  }

  getText(code) {
    if (!code || code.length == 0) {
      return '';
    }
    let arr = [];
    this.getAreaBycode(code, arr, 3);
    return arr.join('/');
  }

  getRealCode(code) {
    let arr = [];
    this.getPcode(code, arr, 3);
    return arr;
  }

  getPcode(id, arr, index) {
    for(let item of this.all){
        if(item.id === id && item.index == index){
          arr.unshift(id);
          if('86' != item.pid){
            this.getPcode(item.pid, arr, --index)
          }
        }
    }
  }

  getPcode1(id, arr, index) {
    for(let item of this.all){
        if(item.id === id && item.index == index){
          arr.unshift(item.text);
          if('86' != item.pid){
            this.getPcode1(item.pid, arr, --index)
          }
        }
    }
  }

  getAreaBycode(id, arr, index) {

      for(let item of this.all){
        if(item.id === id && item.index == index){
            arr.unshift(item.text);
            if('86' != item.pid){
              this.getPcode1(item.pid, arr, --index)
            }
        }
      }
  }
}
