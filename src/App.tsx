import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createUserFormSchema = z.object({
  name: z
    .string()
    .nonempty('This field is required')
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
    .refine((email) => email.endsWith("@email.com"), 'The email has to be @email.com'),
  password: z.string().min(6, "At least 6 characters"),
});

type CreateUserFormData = z.infer<typeof createUserFormSchema>;

export default function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });
  const [output, setOutput] = useState("");

  function createUser(data: any) {
    setOutput(JSON.stringify(data, null, 2));
  }

  return (
    <main className="h-screen bg-zinc-50 flex items-center justify-center flex-col gap-10">
      <form
        onSubmit={handleSubmit(createUser)}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="">Name</label>
          <input
            {...register("name")}
            type="text"
            className="border border-zinc-200 shadow-sm rounded h-10 px-3 text-zinc-700"
          />
          {errors.email && <span>{errors.name?.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="">E-mail</label>
          <input
            {...register("email")}
            type="email"
            className="border border-zinc-200 shadow-sm rounded h-10 px-3 text-zinc-700"
          />
          {errors.email && <span>{errors.email?.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="">Password</label>
          <input
            {...register("password")}
            type="password"
            className="border border-zinc-200 shadow-sm rounded h-10 px-3 text-zinc-700"
          />
          {errors.email && <span>{errors.password?.message}</span>}
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
