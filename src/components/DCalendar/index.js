import dCalendar from "./src/index.vue"
import { withInstall } from '@/utils';
export { useCalendar } from "@/components/Form/src/components/hooks/useCalendarContext.js"

export const DCalendar = withInstall(dCalendar);