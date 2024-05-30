import { useState, useEffect } from "react";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData, useRouteError } from "@remix-run/react";
import {
  delete_question,
  get_questions_and_product,
  update_question,
} from "~/database/hooks/question.server";
import { toast } from "sonner";
import QuestionsTable from "~/components/layouts/admin/tables/table_questions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { set } from "date-fns";

export const meta: MetaFunction = () => {
  return [{ title: "Admin panel | Preguntas" }];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  let response: Record<string, string> = {};
  const body = await request.formData();
  const question_id = body.get("id") as string;
  const answer = body.get("answer") as string;
  if ([answer, question_id].includes(""))
    return json(
      { message: "Campos no validos", type: "error" },
      { status: 400 }
    );
  switch (request.method) {
    case "PUT":
      response = await update_question(question_id, answer);
      break;
    case "DELETE":
      response = await delete_question(question_id);
      break;
    default:
      break;
  }
  return json(response, { status: 200 });
};

export const loader = async ({}: LoaderFunctionArgs) => {
  const data = await get_questions_and_product()
    .then((data) => data)
    .catch((err) => {
      console.log(err);
      return null;
    });
  if (data === null) throw new Error("No existen preguntas aun.");
  return data;
};

export const ErrorBoundary = () => {
  const error = useRouteError() as Error;
  return <h1>{error.message}</h1>;
};

export default function Question() {
  const data = useLoaderData<typeof loader>();
  const [questions, setQuestions] = useState(data.questions);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [subCategory, setSubCategory] = useState<string | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>(
    undefined
  );
  const [selectedStatus, setSeletedStatus] = useState<string | undefined>(
    undefined
  );

  const filter_management = (
    productId?: string,
    status?: string,
    reset?: boolean
  ) => {
    if (!reset) {
      const filtered = data.questions.filter((question) => {
        if (productId) {
          setSelectedProduct(productId);
          if (selectedStatus) {
            if (selectedStatus === "pending") {
              return (
                question.answer === null && question.product.id === productId
              );
            } else if (selectedStatus === "done") {
              return (
                question.answer !== null && question.product.id === productId
              );
            }
          } else {
            return question.product.id === productId;
          }
        }
        if (status === "pending") {
          setSeletedStatus(status);
          if (selectedProduct) {
            return (
              question.answer === null &&
              question.product.id === selectedProduct
            );
          } else {
            return question.answer === null;
          }
        } else if (status === "done") {
          setSeletedStatus(status);
          if (selectedProduct) {
            return (
              question.answer !== null &&
              question.product.id === selectedProduct
            );
          } else {
            return question.answer !== null;
          }
        }
      });
      setQuestions(filtered);
    } else {
      setQuestions(data.questions);
      setCategory("");
      setSubCategory("");
      setSelectedProduct("");
      setSeletedStatus("");
    }
  };

  return (
    <>
      <div className="bg-white flex gap-5 h-14 py-1 px-2 rounded-md mb-2 shadow-sm">
        <p className="text-sm font-medium text-neutral-700">Filtrar por</p>
        <div className="flex gap-5 items-center h-full">
          <Select
            value={category}
            onValueChange={(value) => setCategory(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categorías</SelectLabel>
                {data.categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={subCategory}
            disabled={category ? false : true}
            onValueChange={(value) => setSubCategory(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sub categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sub categoria</SelectLabel>
                {data.categories
                  .find((cat) => cat.id === category)
                  ?.subCategories.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={selectedProduct}
            disabled={subCategory ? false : true}
            onValueChange={(value) => {
              filter_management(value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Producto" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Producto</SelectLabel>
                {data.categories
                  .find((cat) => cat.id === category)
                  ?.subCategories.find((sub) => sub.id === subCategory)
                  ?.product.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={selectedStatus}
            onValueChange={(value) => {
              filter_management(undefined, value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Estado</SelectLabel>
                <SelectItem value="done">Con respuesta</SelectItem>
                <SelectItem value="pending">Sin respuesta</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <button
            onClick={() => filter_management("", "", true)}
            className="bg-neutral-100 text-neutral-700 border h-10 text-sm px-3 py-1 rounded-md"
          >
            Limpiar
          </button>
        </div>
      </div>
      <div className="bg-white rounded-t-md shadow-sm overflow-hidden">
        <QuestionsTable data={questions} />
      </div>
    </>
  );
}
