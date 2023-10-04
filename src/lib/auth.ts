import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { NextAuthOptions } from "next-auth";
import { redis } from "./db";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GitHubProvider from "next-auth/providers/github";

function Getgooglecredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || clientId.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_ID");
  }
  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_SECRET");
  }

  return { clientId, clientSecret };
}

function GetFacebookProvider() {
  const clientId = process.env.FACEBOOK_CLIENT_ID;
  const clientSecret = process.env.FACEBOOK_CLIENT_SECRET;

  if (!clientId || clientId.length === 0) {
    throw new Error("Missing FACEBOOK_CLIENT_ID");
  }
  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("Missing FACEBOOK_CLIENT_SECRET");
  }

  return { clientId, clientSecret };
}

function GetGithubProvider() {
  const clientId = process.env.GITHUB_ID;
  const clientSecret = process.env.GITHUB_SECRET;

  if (!clientId || clientId.length === 0) {
    throw new Error("Missing GITHUB_CLIENT_ID");
  }
  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("Missing GITHUB_CLIENT_SECRET");
  }

  return { clientId, clientSecret };
}

export const authoption: NextAuthOptions = {
  adapter: UpstashRedisAdapter(redis),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: Getgooglecredentials().clientId,
      clientSecret: Getgooglecredentials().clientSecret,
    }),
    FacebookProvider({
      clientId: GetFacebookProvider().clientId,
      clientSecret: GetFacebookProvider().clientSecret,
    }),
    GitHubProvider({
      clientId: GetGithubProvider().clientId,
      clientSecret: GetGithubProvider().clientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const dbuser = ((await redis.get(`user: ${token.id}`)) as User) || null;

      if (!dbuser) {
        token.id = user!.id;
        return token;
      }
      return {
        id: dbuser.id,
        name: dbuser.name,
        image: dbuser.image,
        picture: dbuser.email,
      };
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.name = token.name;
      }
      return session;
    },
    redirect() {
      return "/Dashboard";
    },
  },
};
