import { SessionStorage, redirect, json } from "@remix-run/node";
import { sessionStorage } from "./session.server";

class AuthStrategy {
  private session: SessionStorage;

  constructor(session: SessionStorage) {
    this.session = session;
  }
}
