import select from "./src/index.vue"
import { withInstall } from '@/utils';
export { useSelect } from "@/components/Form/src/components/hooks/useSelectContext.js"

export const Select = withInstall(select);