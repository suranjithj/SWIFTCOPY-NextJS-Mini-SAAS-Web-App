import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect routes that require authentication
        const { pathname } = req.nextUrl;
        
        // Protected routes
        const protectedRoutes = ["/dashboard", "/pages/post", "/pages/settings", "/pages/billing"];
        
        if (protectedRoutes.some(route => pathname.startsWith(route))) {
          return !!token;
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/pages/post/:path*",
    "/pages/settings/:path*",
    "/pages/billing/:path*"
  ]
};
