import { ListPlan } from "@/components/block/BlockPricing/ListPlan";
import { Typography } from "@/components/ui/typography";
import { planService } from "@/services/plan";

export const BlockPricing = async () => {
  const { data: plans } = await planService.getAll();

  return (
    <div className="container py-8 sm:py-16">
      <Typography variant="h2" className="mb-8 text-center">
        Pricing
      </Typography>
      <Typography variant="h3" className="text-center">
        Pricing plans for teams of all sizes
      </Typography>
      <Typography className="mx-auto mb-8 text-center md:w-2/3 lg:w-1/2">
        Choose an affordable plan that’s packed with the best features for
        engaging your audience, creating customer loyalty, and driving sales.
      </Typography>
      {plans && plans.length > 0 && <ListPlan plans={plans} />}
    </div>
  );
};
