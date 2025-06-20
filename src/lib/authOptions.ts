import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import Query from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const email = user.email;

      const test = await Query(
        'SELECT * FROM authorized_emails'
      );
      console.log(test.rows)
      console.log(test)

      const authorized = await Query(
        'SELECT * FROM authorized_emails WHERE email = $1',
        [email]
      );
      if (authorized.rowCount === 0){
        console.log("Unauthorized email:", email);
        return false;
      } 

      const existingUser = await Query('SELECT * FROM users WHERE email = $1', [email]);
      if (existingUser.rowCount === 0) {
        await Query(
          `INSERT INTO users (email, name, image_url, admin)
           VALUES ($1, $2, $3, false)`,
          [email, user.name, user.image]
        );
      }

      return true;
    },
    async session({ session }) {
      const email = session.user?.email;
      if (!email) return session;

      const result = await Query('SELECT id FROM users WHERE email = $1', [email]);
      if ((result.rowCount ?? 0) > 0 && session.user) {
        session.user.id = result.rows[0].id;
      }

      return session;
    },
  },
  pages: {
    error: "/user/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
