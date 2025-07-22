import React from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
import { useNavigate, useLocation, Link } from "react-router";
import { Button } from "primereact/button";
import type { BodyLoginForAccessTokenTokenPost } from "../api/api";
import { FormTextField } from "../components/FormTextField";
import { showError } from "../utils/toast";
import { ROUTES } from "../routes/paths";
import api from "../configApi";

interface LocationState {
  from?: { pathname: string };
}

type LoginData = BodyLoginForAccessTokenTokenPost;

const LoginPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const redirectTo = state?.from?.pathname?.startsWith("/")
    ? state.from.pathname
    : ROUTES.DASHBOARD;

  const methods = useForm<LoginData>({
    defaultValues: { username: "", password: "" },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit: SubmitHandler<LoginData> = async ({ username, password }) => {
    try {
      await login({ username, password });
      const user = await queryClient.fetchQuery({
        queryKey: ["currentUser"],
        queryFn: async () => {
          const res = await api.profile.getProfileProfileGet();
          return res.data;
        },
      });
      if (user) {
        navigate(redirectTo, { replace: true });
      } else {
        showError("Login failed", "Invalid username or password.");
        reset({ password: "" }, { keepErrors: true, keepTouched: false });
      }
    } catch (err: unknown) {

      const message =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      showError("Error", message);
      reset({ password: "" }, { keepErrors: true, keepTouched: false });
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6 text-center">Log in</h1>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <fieldset disabled={isSubmitting} className="space-y-6">
              <FormTextField
                name="username"
                label="Username"
                rules={{ required: "Username is required" }}
              />
              <FormTextField
                name="password"
                label="Password"
                type="password"
                rules={{ required: "Password is required" }}
              />
              <Button
                label="Log in"
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                loading={isSubmitting}
              />
            </fieldset>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to={ROUTES.REGISTER}
              className="text-blue-600 hover:underline"
            >
              Register here
            </Link>
            .
          </p>
        </div>
      </div>
    </FormProvider>
  );
};

export default LoginPage;
