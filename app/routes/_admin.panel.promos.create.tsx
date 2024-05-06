import { useEffect, useState } from "react";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import { getCategories } from "~/database/hooks/category.server";
import Input from "~/components/form/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Checkbox } from "~/components/ui/checkbox";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ActionFunctionArgs, json, MetaFunction } from "@remix-run/node";
import { createPromo } from "~/database/hooks/promo.server";
import { toast } from "sonner";

type PromoFieldsTypes = {
  name: string;
  porcentage: number;
  cupon: string;
  subCategoryId: string;
};

export const meta: MetaFunction = () => {
  return [{ title: "Admin panel | Nueva promoción" }];
};

export const loader = async () => {
  const data = await getCategories();
  const categories = data.map((category) => ({
    value: category.id,
    name: category.name,
    subcategories: category.subCategories.map((subcategory) => ({
      name: subcategory.name,
      value: subcategory.id,
    })),
  }));
  return categories;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const name = body.get("name") as string;
  const porcentage = body.get("porcentage") as string;
  const cupon = body.get("cupon") as string;
  const subCategoryId = body.get("subCategoryId") as string;
  const finalDate = body.get("date") as string;
  const data = await createPromo(
    name,
    parseInt(porcentage),
    cupon,
    subCategoryId,
    finalDate
  );
  return json({ message: "Promoción creada con éxito." }, { status: 200 });
};

export default function promo_create() {
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const initialValues = {
    name: "",
    porcentage: 0,
    cupon: "",
    subCategoryId: "",
  };
  const [promo, setPromo] = useState<PromoFieldsTypes>(initialValues);
  const [typePromo, setTypePromo] = useState("");
  const [subCategories, setSubCategories] = useState<
    Array<Record<string, string>>
  >([]);
  const [date, setDate] = useState<Date>();
  const [alerts, setAlerts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (actionData?.message && actionData?.message.length > 0) {
      toast.success(actionData?.message);
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    }
  }, [actionData?.message]);

  const handleCheckboxChange = (value: string) => {
    setTypePromo(value);
  };

  const handlePorcentage = (value: number) => {
    if (value <= 100) {
      setPromo({ ...promo, porcentage: value });
    }
  };

  const handleCategory = (id: string) => {
    const category = loaderData.filter((item) => item.value === id);
    const { subcategories } = category[0];
    setSubCategories(subcategories);
  };

  return (
    <div>
      {alerts.date && (
        <p className="bg-red-100 text-red-500 text-center text-xl p-1 rounded-sm my-2">
          {alerts.date}
        </p>
      )}
      <Form
        className="grid grid-cols-2 gap-5 pt-5"
        method="post"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData();
          if ([promo.name, promo.porcentage].includes("") || !date) {
            setAlerts({
              ...alerts,
              date: "Existen campos vacios.",
            });
            return;
          }
          formData.append("name", promo.name);
          formData.append("porcentage", promo.porcentage.toString());
          formData.append("cupon", promo.cupon);
          formData.append("subCategoryId", promo.subCategoryId);
          formData.append("date", date.toDateString());
          submit(formData, { method: "POST" });
        }}>
        <Input
          type="text"
          name="name"
          description="Cual sera el nombre de la promoción"
          id="name"
          label="Nombre de promoción"
          handleChange={(e) => setPromo({ ...promo, name: e.target.value })}
          value={promo.name}
        />
        <Input
          type="number"
          name="porcentage"
          description="De cuanto es el descuento de la promoción?"
          id="porcentage"
          label="Cantidad de descuento"
          handleChange={(e) => {
            const value = parseFloat(e.target.value);
            if (isNaN(value)) return;
            handlePorcentage(value);
          }}
          value={promo.porcentage > 0 ? promo.porcentage.toString() : ""}
          max="100"
        />
        <div className="space-y-2">
          <p className="font-medium text-sm text-zinc-800">
            Tipo de promoción:<span className="text-red-500 text-xl">*</span>
          </p>
          <div className="flex gap-4 text-md">
            <div className="flex items-center gap-2">
              <Checkbox
                id="cupon_code"
                checked={typePromo === "cupon"}
                onCheckedChange={() => handleCheckboxChange("cupon")}
              />
              <label htmlFor="cupon_code">Por Cupón</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="sub_category"
                name="cupon"
                checked={typePromo === "subcategory"}
                onCheckedChange={() => handleCheckboxChange("subcategory")}
              />
              <label htmlFor="sub_category">Por subcategoria</label>
            </div>
          </div>
        </div>
        <Input
          disabled={typePromo === "cupon" ? false : true}
          type="text"
          name="code"
          description="Agregar cupón"
          id="code"
          label="Código de descuento"
        />
        <div className="flex gap-3">
          <p className="h-14 flex items-center font-medium text-sm text-zinc-800">
            Categoria:<span className="text-red-500 text-xl">*</span>
          </p>
          <Select
            disabled={typePromo === "subcategory" ? false : true}
            onValueChange={(id) => handleCategory(id)}>
            <SelectTrigger className="flex-1 h-14 text-start text-md focus:ring-sky-200 focus:border-sky-400 border-neutral-200">
              <SelectValue placeholder="Selecciona la categoria" />
            </SelectTrigger>
            <SelectContent>
              {loaderData.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3">
          <p className="h-14 flex items-center font-medium text-sm text-zinc-800">
            Asignar:<span className="text-red-500 text-xl">*</span>
          </p>
          <Select
            disabled={
              typePromo === "subcategory" && subCategories.length > 0
                ? false
                : true
            }
            onValueChange={(id) => setPromo({ ...promo, subCategoryId: id })}>
            <SelectTrigger className="flex-1 h-14 text-start text-md focus:ring-sky-200 focus:border-sky-400 border-neutral-200">
              <SelectValue placeholder="Selecciona la subcategoria correspondiente" />
            </SelectTrigger>
            <SelectContent>
              {subCategories.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Popover onOpenChange={(e) => console.log(e)}>
          <PopoverTrigger asChild onChange={(e) => console.log(e)}>
            <Button
              variant={"outline"}
              className={cn(
                "h-14 justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Fin de la promocion</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(e) => {
                setDate(e);
                if (alerts.promo) setAlerts({ ...alerts, date: "" });
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button className="w-32 h-12 text-lg font-normal">Agregar</Button>
      </Form>
    </div>
  );
}
