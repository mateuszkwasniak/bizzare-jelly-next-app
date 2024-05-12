import { deleteAuthTokenCookie } from "@/app/actions/auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const signOut = async (router: AppRouterInstance) => {
  await deleteAuthTokenCookie();
  router.push("/");
};
