"use server";

import { Credential } from "@/models/Credential";
import { SignUpCredential } from "@/models/SignUpCredential";
import { verify } from "@/utils/jwt";
import { strapiSignIn, strapiSignUp } from "@/utils/strapi/post";
import { validateOrReject } from "class-validator";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const setAuthCookies = (jwt: string, username: string) => {
  cookies().set(process.env.JWT_AUTH_TOKEN_COOKIE_NAME as string, jwt, {
    httpOnly: true,
    secure: true,
    path: "/",
  });

  cookies().set(process.env.AUTH_USERNAME_COOKIE_NAME as string, username, {
    httpOnly: true,
    secure: true,
    path: "/",
  });
};

export async function signIn(creds: Credential): Promise<{
  jwt?: string;
  username?: string;
  error?: string;
}> {
  try {
    const credential = new Credential(creds.identifier, creds.password);

    await validateOrReject(credential);

    const response = await strapiSignIn(credential);

    if (response?.data) {
      const {
        jwt,
        user: { username },
      } = response.data;

      setAuthCookies(jwt, username);

      return { jwt, username };
    } else throw new Error(response?.error);
  } catch (error: any) {
    console.log(error);
    return {
      error: error?.message || "Not able to sign in, please try again later",
    };
  }
}

export async function signUp(creds: ISignUpCredential): Promise<{
  jwt?: string;
  username?: string;
  error?: string;
}> {
  try {
    const credential = new SignUpCredential(
      creds.username,
      creds.firstName,
      creds.lastName,
      creds.email,
      creds.password
    );

    await validateOrReject(credential);

    const response = await strapiSignUp({
      username: creds.username,
      firstName: creds.firstName,
      lastName: creds.lastName,
      email: creds.email,
      password: creds.password,
    });

    if (response?.data) {
      const {
        jwt,
        user: { username },
      } = response.data;

      setAuthCookies(jwt, username);

      return { jwt, username };
    } else {
      throw new Error(response?.error);
    }
  } catch (error: any) {
    console.log(error);

    return {
      error: error?.message || "Not able to sign up, please try again later",
    };
  }
}

export async function googleSignIn() {
  redirect(`${process.env.STRAPI_API_URL}connect/google`);
}

export async function refreshAuthState() {
  const accessToken = cookies().get(
    process.env.JWT_AUTH_TOKEN_COOKIE_NAME as string
  )?.value;

  const username = cookies().get(
    process.env.AUTH_USERNAME_COOKIE_NAME as string
  )?.value;

  if (accessToken && username) {
    return { jwt: accessToken, username };
  } else {
    return { error: "Tokens missing!" };
  }
}

export async function deleteAuthTokenCookie() {
  cookies().delete(process.env.JWT_AUTH_TOKEN_COOKIE_NAME as string);
  cookies().delete(process.env.AUTH_USERNAME_COOKIE_NAME as string);
}

export async function verifyJWT(jwt: string) {
  return await verify(jwt, process.env.JWT_SECRET as string);
}
