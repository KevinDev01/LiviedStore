import { z } from "zod";

const regEXP = new RegExp("[A-Za-z]+");

export const registerSchema = z
  .object({
    name: z
      .string({ required_error: "El nombre de usuario es obligatorio" })
      .regex(regEXP, { message: "Tu nombre solo debe contener letras" })
      .min(2, { message: "El nombre es obligatorio" }),
    lastname: z
      .string({ required_error: "El apellido de usuario es obligatorio" })
      .regex(regEXP, { message: "Tu apellido solo debe contener letras" })
      .min(2, { message: "El apellido es obligatorio" }),
    email: z
      .string({ required_error: "El correo electrónico es requerido" })
      .email({ message: "Email no valido" }),
    password: z
      .string({ required_error: "El password es requerido" })
      .min(8, { message: "El password es demasiado corto" }),
    repeatPassword: z
      .string({ required_error: "El password es requerido" })
      .min(8, { message: "Repite tu contraseña" }),
  })
  .refine((values) => values.password === values.repeatPassword, {
    message: "Tus passwords no coinciden",
  });

export const authenticateSchema = z.object({
  email: z
    .string({ required_error: "El correo electrónico es requerido" })
    .email({ message: "Email no valido" }),
  password: z
    .string({ required_error: "El password es requerido" })
    .min(8, { message: "El password es demasiado corto" }),
});
