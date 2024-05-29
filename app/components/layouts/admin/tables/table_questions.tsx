// base bg-neutral-200 text-neutral-600 border-neutral-300
import { formatterDate } from "~/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Form } from "@remix-run/react";
type TableProps = {
  data: any[];
};

const QuestionsTable = ({ data }: TableProps) => {
  return (
    <table className="w-full block">
      <thead className="block w-full h-10 px-1 bg-sky-200 border-b border-b-sky-300">
        <tr className="flex items-center w-full h-10">
          <th className="text-sky-600 font-normal flex-1">Question</th>
          <th className="text-sky-600 font-normal w-36">Product</th>
          <th className="text-sky-600 font-normal w-36">User</th>
          <th className="text-sky-600 font-normal w-36">Status</th>
          <th className="text-sky-600 font-normal w-36">CreateAt</th>
          <th className="text-sky-600 font-normal w-36">Answer</th>
        </tr>
      </thead>
      <tbody className="block w-full">
        {data.map((item, index) => (
          <tr
            key={index}
            className="odd:bg-white even:bg-slate-100 flex items-center px-2 h-12 border-t border-t-neutral-300"
          >
            <td className="flex-1">{item.question}</td>
            <td className="w-36 flex justify-center items-center">
              {item.product.name}
            </td>
            <td className="w-36 flex justify-center items-center">
              {item.user.name} {item.user.lastname}
            </td>
            <td className="w-36 flex justify-center items-center">
              <span
                className={`p-1 rounded-md text-sm ${
                  item.answer === null
                    ? "bg-neutral-200 text-neutral-600"
                    : "bg-green-200 text-green-600"
                }`}
              >
                {item.answer === null ? "Pending" : "Done"}
              </span>
            </td>
            <td className="w-36 flex justify-center items-center">
              {formatterDate(item.createdAt)}
            </td>
            <td className="w-36 flex justify-center items-center">
              <Sheet>
                <SheetTrigger className="p-1 bg-indigo-200 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4 text-indigo-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </SheetTrigger>
                <SheetContent className="flex flex-col justify-between">
                  <div>
                    <SheetHeader>
                      <SheetTitle>Datalles de la pregunta</SheetTitle>
                      <SheetDescription className="flex gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
                          />
                        </svg>
                        ID: {item.user.id}
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-2">
                      <p className="text-sm font-medium">Producto:</p>
                      <p className="text-sm">{item.product.name}</p>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20"
                      />
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium">Pregunta:</p>
                      <p className="text-sm">{item.question}</p>
                    </div>
                    <Form>
                      <div className="mt-2">
                        <label className="text-sm font-medium" htmlFor="answer">
                          Respuesta
                        </label>
                        <textarea
                          className="w-full h-44 p-2 mt-1 border border-neutral-300 rounded-md resize-none"
                          name="answer"
                          id="answer"
                          required
                        />
                      </div>
                      <div className="mt-2">
                        <button
                          type="submit"
                          className="w-full bg-sky-200 text-sky-600 font-medium p-1 rounded-md"
                        >
                          Responder
                        </button>
                      </div>
                    </Form>
                  </div>
                  <div className="space-y-1">
                    <p className="test-sm text-neutral-800">
                      La pregunta infrige las normas?
                    </p>
                    <button className="bg-red-200 text-red-600 p-1 rounded-md w-full">
                      Eliminar pregunta
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default QuestionsTable;
