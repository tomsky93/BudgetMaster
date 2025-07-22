import { format } from "date-fns";

export const toApiDate = (d: Date | string) =>
  format(new Date(d), 'yyyy-MM-dd');