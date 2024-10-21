"use client";
import { credentialsSignUp } from "@/action/auth";
import { SignUpSchema } from "@/lib/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const useSignUp = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    mode: "onChange",
  });

  const onRegister = handleSubmit(async (values) => {
    try {
      setLoading(true);
      const response = await credentialsSignUp(values.email, values.password);
      if (response) {
        setLoading(false);
        if (response.success) {
          setLoading(false);
          toast.success(response.message);
          reset();
        } else toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  });
  return {
    onRegister,
    register,
    errors,
    loading,
  };
};
