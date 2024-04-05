import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Admin panel | Pedidos" }];
};

export default function Tracking() {
  return (
    <section>
      <h2>Pedidos</h2>
      <div className="border rounded-md h-20 w-full mx-auto mt-2 flex flex-col items-center justify-center gap-2">
        <p className="text-md text-stone-800">Aun no existe pedidos.</p>
      </div>
    </section>
  );
}
