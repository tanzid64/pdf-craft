"use client";
import { credentialsSignIn } from "@/action/auth";
import { SignInSchema } from "@/lib/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const useSignIn = () => {
  const redirectPathName = useSearchParams().get("next");
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    mode: "onChange",
  });

  const onLogin = handleSubmit(async (values) => {
    try {
      setLoading(true);
      const response = await credentialsSignIn(
        values.email,
        values.password,
        redirectPathName,
      );
      if (response) {
        setLoading(false);
        if (response.success) {
          toast.success(response.message);
          reset();
        } else toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  });
  return {
    onLogin,
    register,
    errors,
    loading,
  };
};
