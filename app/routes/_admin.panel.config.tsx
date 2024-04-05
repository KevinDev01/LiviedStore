import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Admin panel | Configuración" }];
};

export default function AdminConfig() {
  return (
    <>
      <section>
        <h2>Banners</h2>
        <div className="border rounded-md h-20 w-full mx-auto mt-2 flex flex-col items-center justify-center gap-2">
          <p className="text-md text-stone-800">
            Aun no existen banners disponibles.
          </p>
        </div>
      </section>
      <section>
        <h2>Cupones</h2>
        <div className="border rounded-md h-20 w-full mx-auto mt-2 flex flex-col items-center justify-center gap-2">
          <p className="text-md text-stone-800">
            Aun no existen cupones creados.
          </p>
        </div>
      </section>
    </>
  );
}
