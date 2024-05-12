"use client";

import { useEffect } from "react";
import { useAuthState } from "@/hooks/store/auth";
import { useSearchParams } from "next/navigation";

export default function AuthController({
  auth,
}: {
  auth:
    | {
        jwt: string;
        username: any;
        error?: undefined;
      }
    | {
        error: string;
        jwt?: undefined;
        username?: undefined;
      };
}) {
  const updateAuthState = useAuthState((state) => state.updateAuth);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (auth?.error || searchParams.get("signed-out") === "true") {
      updateAuthState({ username: "", jwt: "" });
    }
  }, [auth?.error, searchParams, updateAuthState]);

  useEffect(() => {
    if (auth?.jwt && auth?.username) {
      updateAuthState({ username: auth.username, jwt: auth.jwt });
    }
  }, [auth?.jwt, auth?.username, updateAuthState]);

  return null;
}
