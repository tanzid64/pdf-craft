import { BillingForm } from '@/components/forms/billing';
import { getUserSubscriptionPlan } from '@/lib/stripe';
import { FC } from 'react';

const BillingPage: FC = async () => {
  const subscriptionPlan = await getUserSubscriptionPlan();
  return(
    <BillingForm subscriptionPlan={subscriptionPlan} />
  );
};

export default BillingPage;
