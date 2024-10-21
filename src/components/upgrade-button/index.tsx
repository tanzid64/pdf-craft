"use client";
import { trpc } from "@/app/_trpc/client";
import { ArrowRight } from "lucide-react";
import { FC } from "react";
import { Button } from "../ui/button";

export const UpgradeButton: FC = () => {
  const { mutate: createStripeSession } = trpc.createStripeSession.useMutation({
    onSuccess: ({ url }) => {
      window.location.href = url ?? "/dashboard/billing";
    },
  });
  return (
    <Button className="w-full" onClick={() => createStripeSession()}>
      Upgrade Now <ArrowRight className="h5 w-5 ml-1.5" />
    </Button>
  );
};
