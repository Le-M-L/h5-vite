import { computed, ref, unref } from 'vue';

export function useListValues({ checkRef, formValues, emit }) {
  const schema = unref(formValues).schema;
  const field = unref(formValues).field;
  // let popupMulti = schema.popupMulti;
  /**
   * 获取选中的data
   */
  function getCheckValues() {

    let  tempCkeckArr = Object.values(unref(checkRef)).filter(item => item.checked )

    let orgFields = schema.orgFields.split(',');
    let destFields = schema.destFields.split(',');
    // let index = destFields.indexOf(field);
    let params = {};
    // let showText = {}
    for (let i = 0; i < orgFields.length; i++) {
      let data = [];
      tempCkeckArr.forEach((item) => {
        let val = item[orgFields[i]];
        if (typeof val == 'undefined' || val == null || val.toString() == '') {
          val = '';
        }
       data.push(val);
      });
      params[destFields[i]] = data.join(',');
      // showText[orgFields[i]] = data.join(',');
    }
    // const fieldName = showText[orgFields[index]];
    // emit('change',null,{
    //   ...params,
    //   flag:'map'
    // })
    return {
      params,
      // fieldName,
    };
  }

  return {
    getCheckValues,
  };
}
