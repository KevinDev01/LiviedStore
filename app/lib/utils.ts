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
  1;
}
