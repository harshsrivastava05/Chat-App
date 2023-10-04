import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

type Userid = string;

declare module "next-auth/jwt" {
  interface JWT {
    id: Userid;
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: Userid;
    };
  }
}
