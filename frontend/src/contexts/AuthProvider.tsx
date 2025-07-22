import React, { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { BodyLoginForAccessTokenTokenPost, UserSchema } from "../api/api";
import api from "../configApi";
import { AuthContext } from "./AuthContext";
import { ROUTES } from "../routes/paths";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const publicPaths: string[] = [ROUTES.LOGIN, ROUTES.REGISTER];
  const isPublicRoute = publicPaths.includes(location.pathname);
  const {
    data: userData,
    isLoading: isLoadingProfile,
    isError,
  } = useQuery<UserSchema | null, Error>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const res = await api.profile.getProfileProfileGet();
        return res.data;
      } catch {
        return null;
      }
    },
    retry: false,
    enabled: !isPublicRoute,
  });
  const user: UserSchema | null = isError ? null : (userData ?? null);
  const isLoading = isPublicRoute ? false : isLoadingProfile;
  const isAuthenticated = Boolean(user);

  const loginMutation = useMutation<
    void,
    Error,
    BodyLoginForAccessTokenTokenPost
  >({
    mutationFn: (creds) =>
      api.token.loginForAccessTokenTokenPost(creds).then((res) => res.data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  const login = (creds: BodyLoginForAccessTokenTokenPost) =>
    loginMutation.mutateAsync(creds);

  const logoutMutation = useMutation({
    mutationFn: () => api.logout.logoutLogoutPost().then(() => {}),
    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], null);
      navigate(ROUTES.LOGIN);
    },
  });

  const logout = () => {
    logoutMutation.mutate();
  };

   if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span>Loading…</span>
      </div>
    );
  }


  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
