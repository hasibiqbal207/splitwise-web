import { format, formatDistanceToNow } from "date-fns";

export function formatDate(date) {
  return format(new Date(date), "dd MMMM yyyy");
}

export function formatDateTime(date) {
  return format(new Date(date), "dd MMM yyyy HH:mm");
}

export function formatDateTimeWithSuffix(date) {
  return format(new Date(date), "dd/MM/yyyy hh:mm p");
}

export function formatTimeDistanceToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}
