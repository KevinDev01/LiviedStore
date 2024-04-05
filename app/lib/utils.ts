export function formatterPrice(price: number) {
  const formatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });
  const currency = formatter.format(price);
  return currency;
}
