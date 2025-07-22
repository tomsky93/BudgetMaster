import { useContext } from "react";
import { AuthContext, AuthContextType } from "../contexts/AuthContext";

const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};

export default useAuth;