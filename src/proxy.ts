import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      // Eğer kullanıcı /admin ile başlayan bir rotaya gitmek istiyorsa
      if (req.nextUrl.pathname.startsWith("/admin")) {
        // Yalnızca rolü ADMIN olanlara izin ver
        return token?.role === "ADMIN";
      }
      
      return !!token;
    },
  },
  pages: {
    // Yetkisiz erişimlerde yönlendirilecek giriş sayfası
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export const config = {
  matcher: ["/admin/:path*"],
};
