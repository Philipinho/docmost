import { Alert } from "@mantine/core";
import { useAtom } from "jotai";
import { workspaceAtom } from "@/features/user/atoms/current-user-atom.ts";
import { useBillingQuery } from "@/ee/billing/queries/billing-query.ts";
import { getTrialDaysLeft } from "@/ee/billing/utils.ts";

export default function BillingTrial() {
  const [workspace] = useAtom(workspaceAtom);
  const { data: billing, isLoading } = useBillingQuery();

  if (isLoading) {
    return null;
  }

  const daysLeft = getTrialDaysLeft(workspace?.trialEndAt);

  return (
    <>
      {daysLeft !== 0 && !billing && (
        <Alert title="Your Trial is Active 🎉" color="blue" radius="md">
          You have {daysLeft} {daysLeft === 1 ? "day" : "days"} left in your
          14-day trial. Please subscribe to a plan before your trial ends.
        </Alert>
      )}

      {daysLeft === 0 && !billing && (
        <Alert title="Your Trial has ended" color="red" radius="md">
          Your 14-day trial has come to an end. Please subscribe to a plan to
          continue using this service.
        </Alert>
      )}
    </>
  );
}
