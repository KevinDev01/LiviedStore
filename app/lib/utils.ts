import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
