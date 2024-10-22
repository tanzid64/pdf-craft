import { Dashboard } from "@/components/dashboard";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FC } from "react";

const DashbaordPage: FC = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }
  const subscriptionPlan = await getUserSubscriptionPlan();
  return (
    <div className="">
      <Dashboard subscriptionPlan={subscriptionPlan} />
    </div>
  );
};

export default DashbaordPage;
