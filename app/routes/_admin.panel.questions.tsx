import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { get_questions } from "~/database/hooks/question.server";
import QuestionsTable from "~/components/layouts/admin/tables/table_questions";

export const loader = async ({}: LoaderFunctionArgs) => {
  const data = await get_questions();
  if (!data) throw new Error("No existen preguntas aun.");
  return data;
};

export default function Question() {
  const questions = useLoaderData<typeof loader>();

  return (
    <div className="bg-white rounded-t-md shadow-sm overflow-hidden">
      <QuestionsTable data={questions} />
    </div>
  );
}
