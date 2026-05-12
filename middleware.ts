import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },

        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },

        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isDashboard =
    request.nextUrl.pathname.startsWith("/dashboard");

  const isAuthPage =
    request.nextUrl.pathname === "/auth/signin" ||
    request.nextUrl.pathname === "/auth/signup";

  // protect dashboard routes
  if (!user && isDashboard) {
    return NextResponse.redirect(
      new URL("/auth/signin", request.url)
    );
  }

  // prevent logged in users from seeing auth pages
  if (user && isAuthPage) {
    return NextResponse.redirect(
      new URL("/dashboard/generate", request.url)
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/signin",
    "/auth/signup",
  ],
};