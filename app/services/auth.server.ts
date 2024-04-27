import { SessionStorage, redirect, json } from "@remix-run/node";
import { sessionStorage } from "./session.server";
import { AuthRedirectOptions, User, ErrorsBox } from "~/lib/types";
import { registerSchema, authenticateSchema } from "~/schemas/auth.schema";
import { createUser, userFindByEmail } from "~/database/hooks/user.server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class AuthStrategy {
  private session: SessionStorage;

  constructor(session: SessionStorage) {
    this.session = session;
  }

  async login(request: Request, options: AuthRedirectOptions) {
    if (
      typeof options.failureRedirect !== "string" ||
      typeof options.successRedirect !== "string"
    )
      throw new Response("Not exist redirection", { status: 404 });
    const session = await this.session.getSession(
      request.headers.get("Cookie")
    );
    const form = await request.formData();
    const values = {
      email: form.get("email") as string,
      password: form.get("password" as string),
    } as User;

    try {
      // validations of the form
      authenticateSchema.parse(values);
      // find user
      const userFound = await userFindByEmail(values.email);
      // validate credentials of user
      if (userFound === null) {
        session.flash("error", "Usuario no encontrado");
        return redirect(options.failureRedirect, {
          headers: {
            "Set-Cookie": await this.session.commitSession(session),
          },
        });
      }
      const match = await bcrypt.compare(values.password, userFound.password);
      if (!match) {
        session.flash("error", "Email u contraseña no es valida");
        return redirect(options.failureRedirect, {
          headers: {
            "Set-Cookie": await this.session.commitSession(session),
          },
        });
      }
      if (userFound.verified === false) {
        session.flash("error", "Usuario no verificado");
        return redirect(options.failureRedirect, {
          headers: {
            "Set-Cookie": await this.session.commitSession(session),
          },
        });
      }
      // add to jsonwebtoken
      const { name, id, email, lastname } = userFound;
      const token = jwt.sign(
        { id, name, email, lastname },
        process.env.SECRET_KEY as string,
        { expiresIn: "7d" }
      );
      session.set("token", token);
    } catch (error: any) {
      if (error.issues) {
        const { issues } = error as any;
        let alerts = {} as ErrorsBox;
        issues.forEach((field: any) => {
          alerts[field.path[0]] = field.message;
        });
        return json(alerts);
      } else {
        console.log(error);
      }
    }

    return redirect(options.successRedirect, {
      headers: {
        "Set-Cookie": await this.session.commitSession(session),
      },
    });
  }

  async register(request: Request, options: AuthRedirectOptions) {
    let response;
    if (
      typeof options.successRedirect !== "string" ||
      typeof options.failureRedirect !== "string"
    )
      throw new Response("not existe redirection", { status: 500 });
    const session = await this.session.getSession(
      request.headers.get("Cookie")
    );
    const form = await request.formData();
    const values = {
      name: form.get("name") as string,
      lastname: form.get("lastname") as string,
      email: form.get("email") as string,
      password: form.get("password") as string,
      repeatPassword: form.get("repeatPassword") as string,
    };

    try {
      registerSchema.parse(values);
      const passwordHash = await bcrypt.hash(values.password, 10);
      values.password = passwordHash;
      response = await createUser(values);
      console.log(response);
      const { id, name, lastname, email } = response;
      const token = await jwt.sign(
        { id, name, lastname, email },
        process.env.SECRET_KEY as string,
        {
          expiresIn: "7d",
        }
      );
      session.set("token", token);
    } catch (error: any) {
      if (error.issues) {
        const { issues } = error as any;
        let alerts = {} as ErrorsBox;
        issues.forEach((field: any) => {
          alerts[field.path[0]] = field.message;
        });
        return json(alerts);
      } else if (error.meta?.target) {
        console.log(error.meta.target);
        if (error.meta.target === "User_email_key") {
          session.flash("error", "Ups! esta cuenta ya existe.");
          throw redirect(options.failureRedirect, {
            headers: {
              "Set-Cookie": await this.session.commitSession(session),
            },
          });
        } else {
          session.flash("error", "Ups! El nombre de usuario ya esta en uso.");
          throw redirect(options.failureRedirect, {
            headers: {
              "Set-Cookie": await this.session.commitSession(session),
            },
          });
        }
      } else {
        console.log(error);
      }
    }
    return redirect(options.successRedirect, {
      headers: {
        "Set-Cookie": await this.session.commitSession(session),
      },
    });
  }
}

const Authenticator = new AuthStrategy(sessionStorage);
export default Authenticator;
