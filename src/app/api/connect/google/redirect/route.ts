import { NextRequest, NextResponse } from "next/server";
import { setAuthCookies } from "@/app/actions/auth";
import { signInWithGoogleAccessToken } from "@/utils/strapi/get";

export async function GET(req: NextRequest) {
  const accessToken = req.nextUrl.searchParams.get("access_token");

  if (accessToken) {
    try {
      const response = await signInWithGoogleAccessToken(accessToken);

      if (response?.error) {
        throw new Error(response?.error);
      }

      if (response?.data) {
        const { jwt, username } = response?.data;
        setAuthCookies(jwt, username);
        return NextResponse.redirect(new URL(`${process.env.NEXT_BASE_URL}/`));
      }
    } catch (error) {
      return NextResponse.redirect(
        new URL(`${process.env.NEXT_BASE_URL}/auth/login`)
      );
    }
  } else {
    return NextResponse.redirect(
      new URL(`${process.env.NEXT_BASE_URL}/auth/login`)
    );
  }
}
