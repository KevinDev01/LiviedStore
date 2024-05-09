import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { string } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function filterErrorsZod(
  errors: Array<Record<string, string | string[]>>
) {
  const alerts: Record<string, string> = {};
  errors.forEach((error) => {
    const key = Array.isArray(error.path) ? error.path[0] : "";
    alerts[key] = !Array.isArray(error.message) ? error.message : "";
  });
  return alerts;
}

export function formatterPrice(precio: number) {
  const formatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });
  const precioMX = formatter.format(precio);
  return precioMX;
}

export function formatterDate(date: string) {
  const newDate = new Date(date);
  return newDate.toLocaleString("es-MX");
}

export function formatterDateFromString(date: string) {
  if (!date) return;
  const dateObject = new Date(date);
  return new Date(
    Date.UTC(
      dateObject.getFullYear(),
      dateObject.getMonth(),
      dateObject.getDate()
    )
  );
}

export function getPriceWithDiscount(price: number, porcentage: number) {
  const withDiscount = price - (porcentage / 100) * price;
  return formatterPrice(withDiscount);
}

export function getDays(dateObjetive: Date) {
  const today = new Date();
  const timeToday = today.getTime();
  const timeObjetive = dateObjetive.getTime();

  const difference = timeObjetive - timeToday;
  const remainingDays = Math.ceil(difference / (1000 * 60 * 60 * 24));

  return remainingDays;
}

export function getDaysToDB(date: string) {
  const currentDate = new Date();
  const dateObjetive = new Date(date);
  const difference = dateObjetive.getTime() - currentDate.getTime();
  const remainingDays = Math.ceil(difference / (1000 * 60 * 60 * 24));
  return remainingDays;
}
