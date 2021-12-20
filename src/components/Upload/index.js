import { withInstall } from '@/utils';
import basicUpload from './src/BasicUpload.vue';
import uploadFile from './src/UploadFile.vue';

export const BasicUpload = withInstall(basicUpload);
export const UploadFile = withInstall(uploadFile);
