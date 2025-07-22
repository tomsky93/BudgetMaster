import React, { useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../configApi";
import type { UserCreate } from "../api/api";
import { CurrencyEnum, LocaleEnum } from "../api/api";
import { showSuccess, showError } from "../utils/toast";
import { FormTextField, FormSelectField } from "../components";
import { Button } from "primereact/button";
import { useNavigate, useLocation, Link } from "react-router";
import { currencyOptions, localeOptions } from "../utils/preferences";
import { ROUTES } from "../routes/paths";

interface RegistrationFormValues extends UserCreate {
  currency: CurrencyEnum;
  locale: LocaleEnum;
}

const RegistrationPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const methods = useForm<RegistrationFormValues>({
    defaultValues: {
      username: "",
      password: "",
      currency: CurrencyEnum.USD,
      locale: LocaleEnum.EnUS,
    },
  });

  const {
    handleSubmit,
    reset,
    setFocus,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    setFocus("username");
  }, [setFocus]);

  const mutation = useMutation<unknown, Error, RegistrationFormValues>({
    mutationFn: async (data: RegistrationFormValues) => {
      const response = await api.register.registerRegisterPost(data);
      return response.data;
    },
    onSuccess: () => {
      showSuccess("Success", "Registration successful.");
      reset();
      queryClient.invalidateQueries({ queryKey: ["users"] });

      const state = (location.state as { from?: string } | null);
      const redirectTo = state?.from ?? ROUTES.LOGIN;
      navigate(redirectTo);
    },
    onError: (error: Error) => {
      showError("Error", error.message || "Registration failed.");
    },
  });

  const onSubmit: SubmitHandler<RegistrationFormValues> = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <FormProvider {...methods}>
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
              <FormSelectField
                name="currency"
                label="Currency"
                options={currencyOptions}
                placeholder="Select a currency"
                rules={{ required: "Currency is required" }}
              />
              <FormSelectField
                name="locale"
                label="Locale"
                options={localeOptions}
                placeholder="Select a locale"
                rules={{ required: "Locale is required" }}
              />

              <Button
                type="submit"
                label="Register"
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                loading={isSubmitting}
              />
            </fieldset>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to={ROUTES.LOGIN} className="text-blue-600 hover:underline">
              Log in here
            </Link>
            .
          </p>
        </FormProvider>
      </div>
    </div>
  );
};

export default RegistrationPage;
