import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "./lib/supabase";

const createUserFormSchema = z.object({
  avatar: z
    .instanceof(FileList)
    .transform((list) => list.item(0)!)
    .refine(
      (file) => file!.size <= 5 * 1024 * 1024,
      "The file needs to be max 5 Mb"
    ),
  name: z
    .string()
    .nonempty("This field is required")
    .toLowerCase()
    .transform((text) => {
      return text
        .trim()
        .split(" ")
        .map((word) => {
          return word[0].toUpperCase().concat(word.substring(1));
        })
        .join(" ");
    }),
  email: z
    .string()
    .nonempty("This field is required")
    .email("The email is not valid")
    .toLowerCase()
    .refine(
      (email) => email.endsWith("@email.com"),
      "The email has to be @email.com"
    ),
  password: z.string().min(6, "At least 6 characters"),
  techs: z
    .array(
      z.object({
        title: z.string().nonempty("The title is required"),
        knowledge: z.coerce.number().min(1).max(100),
      })
    )
    .min(2, "Insert at least 2 technologies"),
});

type CreateUserFormData = z.infer<typeof createUserFormSchema>;

export default function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });
  const [output, setOutput] = useState("");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "techs",
  });

  async function createUser(data: CreateUserFormData) {
    await supabase.storage
      .from("forms-react")
      .upload(data.avatar?.name, data.avatar);
    console.log(data.avatar);
    setOutput(JSON.stringify(data, null, 2));
  }

  function addNewTech() {
    append({ title: "", knowledge: 0 });
  }

  return (
    <main className="h-screen bg-zinc-50 flex items-center justify-center flex-col gap-10">
      <form
        onSubmit={handleSubmit(createUser)}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="">Avatar</label>
          <input {...register("avatar")} type="file" />
          {errors.avatar && (
            <span className="text-red-500 text-sm">
              {errors.avatar?.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="">Name</label>
          <input
            {...register("name")}
            type="text"
            className="border border-zinc-200 shadow-sm rounded h-10 px-3 text-zinc-700"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.name?.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="">E-mail</label>
          <input
            {...register("email")}
            type="email"
            className="border border-zinc-200 shadow-sm rounded h-10 px-3 text-zinc-700"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">
              {errors.email?.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="">Password</label>
          <input
            {...register("password")}
            type="password"
            className="border border-zinc-200 shadow-sm rounded h-10 px-3 text-zinc-700"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">
              {errors.password?.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="" className="flex items-center justify-between">
            Technologies
            <button
              type="button"
              className="text-emerald-500 text-xs"
              onClick={() => addNewTech()}
            >
              Add
            </button>
          </label>

          {fields.map((field, index) => {
            return (
              <div className="flex flex-row gap-2" key={field.id}>
                <div className="flex flex-col gap-1 flex-1">
                  <input
                    {...register(`techs.${index}.title`)}
                    type="text"
                    className="flex-1 grow border border-zinc-200 shadow-sm rounded h-10 px-3 text-zinc-700"
                  />

                  {errors.techs?.[index]?.title && (
                    <span className="text-red-500 text-sm">
                      {errors.email?.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    {...register(`techs.${index}.knowledge`)}
                    type="number"
                    className="w-14 border border-zinc-200 shadow-sm rounded h-10 px-3 text-zinc-700"
                  />

                  {errors.techs?.[index]?.knowledge && (
                    <span className="text-red-500 text-sm">
                      {errors.techs?.[index]?.knowledge?.message}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {errors.techs && (
            <span className="text-red-500 text-sm">{errors.techs.message}</span>
          )}
        </div>

        <button
          className="bg-emerald-500 rounded font-semibold h-10 hover:bg-emerald-600"
          type="submit"
        >
          Save
        </button>
      </form>

      <pre>{output}</pre>
    </main>
  );
}
