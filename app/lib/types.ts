export type AuthRedirectOptions = {
  failureRedirect?: string;
  successRedirect?: string;
};

export type ErrorsBox = {
  [key: string]: string;
  [index: number]: string;
};

export type Profile = {
  id?: number;
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
};

export type User = {
  id: string;
  name: string;
  lastname: string;
  email: string;
  password: string;
};

export type ValidationErrors = {
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
  repeatPassword?: string;
  undefined?: string;
};
