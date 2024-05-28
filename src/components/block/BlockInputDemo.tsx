"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getDomainName } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Typography } from "@/components/ui/typography";
import { EyeIcon } from "lucide-react";

export const BlockInputDemo = () => {
  const router = useRouter();
  const [domain, setDomain] = useState<string>("");

  const handleSubmit = () => {
    if (!domain) {
      return;
    }

    router.push(`/demo/${getDomainName(domain)}`);
  };

  return (
    <div className="py-8">
      <Typography variant="h1" className="py-8 text-center font-mono">
        Automate your open-graph social images
      </Typography>
      <Typography variant="h4" className="text-center font-mono">
        Get better CTR to your link with engaging OG social images. Fully
        automated screenshots, no code required.
      </Typography>

      <div className="mx-auto flex w-full max-w-md items-center space-x-2 pb-8 pt-12">
        <Input
          title="Enter your website URL to see a live demo:"
          type="text"
          placeholder="yoursite.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <Button onClick={handleSubmit} icon={<EyeIcon className="h-4 w-4" />}>
          View Demo
        </Button>
      </div>
    </div>
  );
};
