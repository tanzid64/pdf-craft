"use client";
import { InputGenerator } from "@/components/global/input-generator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSignUp } from "@/hooks/auth/use-sign-up";
import { FC } from "react";

export const SignUpForm: FC = () => {
  const { onRegister, register, errors, loading } = useSignUp();
  return (
    <Card className="w-[400px]">
      <CardHeader className="text-center">
        <CardTitle>Create an account in quill .</CardTitle>
        <CardDescription>
          Please enter essential information to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Social Logins */}
        <div className="my-4 flex items-center justify-evenly">
          <Button className="flex min-w-[8rem] items-center gap-2">
            {/* <FaGithub /> */}
            <span>Github</span>
          </Button>
          <Button className="flex min-w-[8rem] items-center gap-2">
            {/* <FaGoogle /> */}
            <span>Google</span>
          </Button>
        </div>
        {/* Or */}
        <div className="flex items-center justify-center gap-2">
          <hr className="w-full bg-muted-foreground" />
          <span className="text-muted-foreground">Or</span>
          <hr className="w-full bg-muted-foreground" />
        </div>
        {/* Credintial Form */}
        {/* Email */}
        <form onSubmit={onRegister} className="mt-4 flex flex-col gap-3">
          <InputGenerator
            inputType="input"
            placeholder="Email"
            name="email"
            type="email"
            register={register}
            errors={errors}
          />
          {/* Password */}
          <InputGenerator
            inputType="input"
            placeholder="Password"
            name="password"
            type="password"
            register={register}
            errors={errors}
          />
          {/* Confirm Password */}
          <InputGenerator
            inputType="input"
            placeholder="Confirm Password"
            name="confirmPassword"
            type="password"
            register={register}
            errors={errors}
          />
          <Button type="submit" className="rounded-2xl">
            <span className="mr-4">{loading ? "Loading..." : "Sign up"}</span>
            {/* <FaArrowRight /> */}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
