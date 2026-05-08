import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch("http://property.reworkstaging.name.ng/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });

          const contentType = res.headers.get("content-type");
          if (!res.ok || !contentType || !contentType.includes("application/json")) {
            console.error("Auth failed or non-JSON response");
            return null;
          }

          const response = await res.json();
          const userData = response.data;
          
          if (userData && userData.token) {
            // Decode the JWT to get the expiration time
            let expiresAt = 0;
            try {
              const base64Url = userData.token.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              }).join(''));
              const decoded = JSON.parse(jsonPayload);
              if (decoded.exp) {
                expiresAt = decoded.exp;
              }
            } catch (e) {
              console.error("Failed to decode token", e);
            }

            return {
              id: userData.id,
              email: credentials.email,
              name: userData.full_name || userData.first_name,
              token: userData.token,
              role: userData.role || "USER",
              expiresAt: expiresAt,
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.accessToken = user.token;
        token.role = user.role;
        token.id = user.id;
        token.expiresAt = user.expiresAt;
      }
      
      // Check if token is expired
      if (token.expiresAt && Date.now() / 1000 > token.expiresAt) {
        token.error = "RefreshAccessTokenError";
      }
      
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.role = token.role;
      session.user.id = token.id;
      session.error = token.error;
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET || "fallback_secret_for_development_only",
});