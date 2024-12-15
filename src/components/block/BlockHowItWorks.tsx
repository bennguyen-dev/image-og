import { headers } from "next/headers";
import Link from "next/link";

import { CodeSnippet } from "@/components/customs/code-snippet";
import { Typography } from "@/components/ui/typography";
import { getLinkSmartOGImage, getSnippetHowToUse } from "@/utils";

export const BlockHowItWorks = () => {
  const headersList = headers();

  const host = headersList.get("host");

  return (
    <section
      id="how-it-works"
      className="container flex scroll-mt-20 flex-col items-center justify-center py-8 sm:py-16"
    >
      <Typography variant="h2">How it works</Typography>
      <Typography variant="p" className="mb-4">
        After signing up, just use this URL as the open-graph of any page on
        your website:
      </Typography>
      <Typography variant="code" className="mb-4 break-all">
        https://{host}/api/get?api_key=
        <span className="text-base font-bold text-orange-600">
          {"<api_key>"}
        </span>
        &url=
        <span className="text-base font-bold text-orange-600">
          yourwebsite.com/blogs/article-1
        </span>
      </Typography>

      {host && (
        <CodeSnippet className="w-full sm:w-fit">
          {getSnippetHowToUse({
            host,
            domain: "yourwebsite.com",
            apiKey: "<api_key>",
          })}
        </CodeSnippet>
      )}

      {host && (
        <Typography variant="p" className="break-all">
          Example:{" "}
          <Link
            href={getLinkSmartOGImage({
              host,
              url: host,
              apiKey: process.env.SNAP_OG_API_KEY || "<api_key>",
            })}
            target="_blank"
            className="text-link break-all"
          >
            {getLinkSmartOGImage({
              host,
              url: host,
              apiKey: process.env.SNAP_OG_API_KEY || "<api_key>",
            })}
          </Link>
        </Typography>
      )}
    </section>
  );
};
