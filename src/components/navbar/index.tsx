"use client";
import { credentialsSignOut } from "@/action/auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FC } from "react";
import { MaxWidthWrapper } from "../global/max-width-wrapper";
import { Button, buttonVariants } from "../ui/button";

export const Navbar: FC = () => {
  const session = useSession();
  const user = session.data?.user;
  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            <span>quill.</span>
          </Link>
          {/* TODO add mobile navbar */}
          <div className="hidden items-center space-x-4 sm:flex">
            <>
              <Link
                href="/pricing"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Pricing
              </Link>

              <Link
                href="/auth/sign-in"
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                })}
              >
                Login
              </Link>
              <Link
                href="/auth/sign-up"
                className={buttonVariants({
                  size: "sm",
                })}
              >
                Get Started
              </Link>
              {user && (
                <form action={credentialsSignOut}>
                  <Button variant={"outline"} size={"sm"} type="submit">
                    Logout
                  </Button>
                </form>
              )}
            </>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};
