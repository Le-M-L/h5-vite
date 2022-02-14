import { withInstall } from '@/utils';
import basicUpload from './src/BasicUpload.vue';
import uploadFile from './src/UploadFile.vue';

export { default as BasicUploadFile } from "./src/BasicUploadFile.vue"
export const BasicUpload = withInstall(basicUpload);
export const UploadFile = withInstall(uploadFile);
