import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../configApi";
import { AxiosError } from "axios";
import type { UserSchema, ChangePasswordRequest } from "../../api/api";
import { CurrencyEnum, LocaleEnum } from "../../api/api";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { FormSelectField, FormTextField } from "../../components";
import { showSuccess, showError } from "../../utils/toast";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { localeOptions, currencyOptions } from "../../utils/preferences";

interface ProfileFormValues {
  currency: CurrencyEnum;
  locale: LocaleEnum;
  newPassword?: string;
  confirmPassword?: string;
}

const ProfileForm: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: userProfile, isLoading } = useQuery<UserSchema, Error>({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await api.profile.getProfileProfileGet();
      return response.data as unknown as UserSchema;
    },
  });

  const methods = useForm<ProfileFormValues>({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      currency: userProfile?.currency as CurrencyEnum,
      locale: userProfile?.locale as LocaleEnum,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    reset,
    resetField,
    watch,
    trigger,
    getValues,
    formState: { isSubmitting: isProfileUpdating },
  } = methods;

  useEffect(() => {
    if (userProfile) {
      reset({
        currency: userProfile.currency as CurrencyEnum,
        locale: userProfile.locale as LocaleEnum,
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [userProfile, reset]);

  const updateProfileMutation = useMutation<
    UserSchema,
    Error,
    ProfileFormValues
  >({
    mutationFn: (data) =>
      api.updateProfile
        .updatePreferencesUpdateProfilePatch({
          currency: data.currency,
          locale: data.locale,
        })
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      showSuccess("Success", "Profile was updated successfully.");
    },
    onError: () => showError("Error", "Data did not update."),
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const changePasswordMutation = useMutation<
    { message: string },
    AxiosError<{ detail?: string }>,
    ChangePasswordRequest
  >({
    mutationFn: async (req) => {
      const res =
        await api.changePassword.changePasswordChangePasswordPost(req);
      if (res.error) {
        throw res as unknown as AxiosError<{ detail?: string }>;
      }
      return res.data!;
    },
    onSuccess: ({ message }) => {
      showSuccess("Success", message || "Password changed successfully.");
      setShowPasswordForm(false);
      resetField("newPassword");
      resetField("confirmPassword");
    },
    onError: (err) => {
      const detailFromResponse = err.response?.data?.detail;
      const msg =
        detailFromResponse ?? err.message ?? "An unknown error occurred.";
      showError("Error", msg);
      resetField("newPassword");
      resetField("confirmPassword");
    },
  });

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    await updateProfileMutation.mutateAsync(data);
  };

  const togglePasswordForm = () => {
    setShowPasswordForm((prev) => !prev);
    if (showPasswordForm) {
      resetField("newPassword");
      resetField("confirmPassword");
    }
  };

  const handleChangePassword = async () => {
    const isValid = await trigger(["newPassword", "confirmPassword"]);
    if (!isValid) {
      return;
    }
    const newPwd = getValues("newPassword")!;
    changePasswordMutation.mutate({ new_password: newPwd });
  };

  if (isLoading) {
    return <p className="text-center py-4">Loading profile…</p>;
  }

  return (
    <Card className="mt-8 mx-auto w-full max-w-md shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">User Profile</h2>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <FormSelectField
            name="currency"
            options={currencyOptions}
            placeholder="Select a currency"
            rules={{ required: "Currency is required" }}
            label="Currency"
          />
          <FormSelectField
            name="locale"
            options={localeOptions}
            placeholder="Select a locale"
            rules={{ required: "Locale is required" }}
            label="Locale"
          />
          <Button
            type="submit"
            label="Update Profile"
            icon="pi pi-check"
            loading={isProfileUpdating}
          />
          <Divider className="my-4" />
          <Button
            type="button"
            label={showPasswordForm ? "Cancel" : "Change Password"}
            icon={showPasswordForm ? "pi pi-times" : "pi pi-lock"}
            onClick={togglePasswordForm}
            className="p-button-secondary"
          />
          {showPasswordForm && (
            <div className="flex flex-col space-y-3">
              <FormTextField
                name="newPassword"
                label="Password"
                type="password"
                rules={{ required: "Password is required" }}
              />
              <FormTextField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                rules={{
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === watch("newPassword") || "Passwords do not match",
                }}
              />
              <Button
                type="button"
                label="Save Password"
                icon="pi pi-save"
                onClick={handleChangePassword}
                loading={changePasswordMutation.isPending}
                className="p-button-success"
              />
            </div>
          )}
        </form>
      </FormProvider>
    </Card>
  );
};

export default ProfileForm;
