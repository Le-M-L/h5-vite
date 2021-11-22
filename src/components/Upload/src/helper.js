import { useGlobSetting } from '@/hooks/setting';
import { buildUUID } from '@/utils/uuid';

const { staticDomainURL } = useGlobSetting()

export function checkFileType(file, accepts) {
  const newTypes = accepts.join('|');
  // const reg = /\.(jpg|jpeg|png|gif|txt|doc|docx|xls|xlsx|xml)$/i;
  const reg = new RegExp('\\.(' + newTypes + ')$', 'i');

  return reg.test(file.name);
}

export function checkImgType(file) {
  return isImgTypeByName(file.name);
}

export function isImgTypeByName(name) {
  return /\.(jpg|jpeg|png|gif)$/i.test(name);
}

export function getBase64WithFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve({ result: reader.result, file });
    reader.onerror = (error) => reject(error);
  });
}

export function getFileAccessHttpUrl(avatar,subStr) {
  if(!subStr) subStr = 'http'
  try {
    if(avatar && avatar.startsWith(subStr)){
      return avatar;
    }else{
      if(avatar &&　avatar.length>0 && avatar.indexOf('[')==-1){
        return staticDomainURL + "/" + avatar;
      }
    }
  }catch(err){
   return;
  }
}

export function initFileListArr(val) {
  let fileList = [];
  for (var a = 0; a < val.length; a++) {
    let url = getFileAccessHttpUrl(val[a].filePath);
    fileList.push({
      uid: buildUUID(),
      name: val[a].fileName,
      status: 'done',
      url: url,
      response: {
        status: 'history',
        message: val[a].filePath,
      },
    });
  }
  return fileList = fileList;
}