import { SignInForm } from "@/components/forms/sign-in";
import { FC } from "react";

const SignIn: FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <SignInForm />
    </div>
  );
};

export default SignIn;
