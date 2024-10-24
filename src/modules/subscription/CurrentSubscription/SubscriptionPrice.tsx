import { Typography } from "@/components/ui/typography";
import { formatPrice } from "@/lib/utils";

export function SubscriptionPrice({
  endsAt,
  price,
  interval,
  intervalCount,
  isUsageBased,
}: {
  endsAt?: string | null;
  price: string;
  interval?: string | null;
  intervalCount?: number | null;
  isUsageBased?: boolean;
}) {
  if (endsAt) return null;

  let formattedPrice = formatPrice(price);

  if (isUsageBased) {
    formattedPrice += "/unit";
  }

  const formattedIntervalCount =
    intervalCount && intervalCount !== 1 ? `/${intervalCount} ` : "/";

  return (
    <Typography>
      <span className="text-4xl font-bold">{formattedPrice}</span>
      <span className="text-sm text-muted-foreground">{`${formattedIntervalCount}${interval}`}</span>
    </Typography>
  );
}
