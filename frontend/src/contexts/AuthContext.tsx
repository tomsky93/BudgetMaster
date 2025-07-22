import  {
  createContext,
} from "react";
import type {
  BodyLoginForAccessTokenTokenPost,
  UserSchema,
} from "../api/api";

export interface AuthContextType {
  user: UserSchema | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (creds: BodyLoginForAccessTokenTokenPost) => Promise<unknown>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

