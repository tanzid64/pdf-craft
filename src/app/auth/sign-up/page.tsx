import { SignUpForm } from "@/components/forms/sign-up";
import { FC } from "react";

const SignUpPage: FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
