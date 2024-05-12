import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verify } from "./utils/jwt";

const allowedOrigns = [
  "http://localhost:3000",
  "https://bizzare-jelly.vercel.app",
];

const protectedRoutes = ["/dashboard", "/auth/login"];

export async function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (origin !== null && !allowedOrigns.includes(origin)) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  let checkJWT = false;

  protectedRoutes.forEach((route) => {
    if (request.nextUrl.pathname.startsWith(route)) {
      checkJWT = true;
    }
  });

  if (checkJWT) {
    const accessToken: string | undefined = request.cookies.get(
      process.env.JWT_AUTH_TOKEN_COOKIE_NAME as string
    )?.value;

    if (!accessToken) {
      if (
        request.nextUrl.pathname.includes("/auth/login") ||
        request.nextUrl.pathname.includes("/checkout")
      ) {
        return NextResponse.next();
      } else {
        const url = new URL(
          `/auth/login?from=${request.nextUrl.pathname}`,
          request.url
        );
        return NextResponse.redirect(url);
      }
    } else {
      try {
        await verify(accessToken, process.env.JWT_SECRET as string);

        if (request.nextUrl.pathname.includes("/auth/login")) {
          return NextResponse.redirect(new URL("/", request.url));
        } else {
          return NextResponse.next();
        }
      } catch (e: any) {
        let url: URL;

        if (!request.nextUrl.pathname.includes("/auth/login")) {
          url = new URL(
            `/auth/login?from=${request.nextUrl.pathname}?${request.nextUrl.searchParams}&signed-out=true`,
            request.url
          );
        } else {
          url = new URL(
            `/auth/login?${request.nextUrl.searchParams}&signed-out=true`,
            request.url
          );
        }

        const response = NextResponse.redirect(url);

        response.cookies.set(
          process.env.JWT_AUTH_TOKEN_COOKIE_NAME as string,
          "",
          {
            expires: new Date(Date.now()),
          }
        );

        response.cookies.set(
          process.env.AUTH_USERNAME_COOKIE_NAME as string,
          "",
          {
            expires: new Date(Date.now()),
          }
        );

        return response;
      }
    }
  } else {
    return NextResponse.next();
  }
}
