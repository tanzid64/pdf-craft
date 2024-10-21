"use client";
import { SignIn, useSignIn } from "@clerk/nextjs";
import { OAuthStrategy } from "@clerk/types";

export default function Page() {
  const { signIn } = useSignIn();
  if (!signIn) return null;
  const signInWith = (strategy: OAuthStrategy) => {
    return signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: "/sign-in/sso-callback",
      redirectUrlComplete: "/dashboard",
    });
  };
  return (
    <>
      {/* <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center justify-center">
            <Image src={"/logo.png"} alt="logo" width={150} height={100} />
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button
              className="w-full"
              variant={"outline"}
              onClick={() => signInWith("oauth_google")}
            >
              <Image
                src={"/google.svg"}
                alt="logo"
                width={20}
                height={20}
                className="mr-2"
              />
              Sign in with Google
            </Button>
            <Button
              onClick={() => signInWith("oauth_github")}
              variant={"outline"}
              className="w-full"
            >
              <Image
                src={"/github.svg"}
                alt="logo"
                width={20}
                height={20}
                className="mr-2"
              />
              Sign in with GitHub
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-center flex-col gap-2">
          <p className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href={"/auth/sign-up"} className="text-primary">Sign up</Link>{" "}
          </p>
          <p className="text-sm text-muted-foreground">
            Powered by {"@"}PDFCraft
          </p>
        </CardFooter>
      </Card> */}
      <SignIn />
    </>
  );
}
