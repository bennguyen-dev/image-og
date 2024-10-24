import { cx } from "class-variance-authority";
import { CheckIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

interface IProps {
  className?: string;
}

export const DefaultSubscription = ({ className }: IProps) => {
  return (
    <Card className={cx("flex", className)}>
      <CardHeader className="flex-1">
        <CardTitle>Current Plan: Free</CardTitle>
        <CardDescription>
          You are currently on the Free plan, billed monthly.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <Typography className="mb-4">What's included:</Typography>
        <ul className="space-y-2.5 text-sm">
          <li className="flex space-x-2">
            <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span className="text-muted-foreground">30 images/month</span>
          </li>
          <li className="flex space-x-2">
            <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span className="text-muted-foreground">Unlimited websites</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};
