import { SignOutButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { MaxWidthWrapper } from "../global/max-width-wrapper";
import { MobileNav } from "../mobile-nav";
import { Button, buttonVariants } from "../ui/button";
import UserAccountNav from "../user-account";

export const Navbar: FC = async () => {
  const { userId } = auth();
  const user = await currentUser();
  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            <Image
              src={"/logo.png"}
              alt="logo"
              width={100}
              height={100}
              className="z-40"
            />
          </Link>

          <MobileNav isAuth={!!userId} />
          <div className="hidden items-center space-x-4 sm:flex">
            {!userId ? (
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
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Dashboard
                </Link>
                <SignOutButton>
                  <Button variant={"outline"} size={"sm"} type="submit">
                    Logout
                  </Button>
                </SignOutButton>
                <UserAccountNav
                  name={
                    !user?.firstName || !user.lastName
                      ? "Your Account"
                      : `${user.firstName} ${user.lastName}`
                  }
                  email={user?.emailAddresses?.[0]?.emailAddress ?? ""}
                  imageUrl={user?.imageUrl ?? ""}
                />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};
