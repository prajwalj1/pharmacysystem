import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import dbConnect from "@/dbconfig/dbConnect";
import User from "@/models/user";


export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await dbConnect();

          // 1. Find User
          const user = await User.findOne({ email: credentials.email.toLowerCase() });
          if (!user) {
            console.log("❌ Auth Fail: No user found with email:", credentials.email);
            return null;
          }

          // 2. Check Password
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            console.log("❌ Auth Fail: Incorrect password for:", credentials.email);
            return null;
          }

          // 3. Return User Object
          console.log("✅ Auth Success:", user.email, "Role:", user.role);
          return {
            id: user._id.toString(),
            name: user.username,
            email: user.email,
            role: user.role, // Ensure this is "ADMIN" in your DB
          };
        } catch (err) {
          console.error("Authorize error:", err);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.role = token.role;
      return session;
    },
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };