import { create } from "zustand";

interface Auth {
  jwt: string;
  username: string;
}

interface AuthState {
  auth: Auth;
  updateAuth: (data: Auth) => void;
}

export const useAuthState = create<AuthState>((set) => ({
  auth: {
    jwt: "",
    username: "",
  },

  updateAuth: (data: Auth) =>
    set(() => ({ auth: { jwt: data.jwt, username: data.username } })),
}));
