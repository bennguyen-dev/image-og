import chromium from "@sparticuz/chromium-min";
import puppeteer, { Browser } from "puppeteer-core";

import { IResponse } from "@/lib/type";
import { getUrlWithProtocol } from "@/lib/utils";
import {
  IGetInfoByUrl,
  IGetInfoByUrlResponse,
  ISearchSiteLinks,
  ISearchSiteLinksResponse,
} from "@/sevices/crawl";

class CrawlService {
  async getInfoByUrl({
    url,
  }: IGetInfoByUrl): Promise<IResponse<IGetInfoByUrlResponse | null>> {
    console.time(`Total execution time crawl info for url: ${url}`);

    const urlWithProtocol = getUrlWithProtocol(url);

    let browser: Browser | null = null;

    try {
      browser = await puppeteer.launch({
        args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: { width: 1200, height: 628 },
        executablePath: await chromium.executablePath(
          `https://${process.env.AWS_CDN_HOSTNAME}/chromium/chromium-v123.0.1-pack.tar`,
        ),
        headless: true,
        ignoreHTTPSErrors: true,
      });

      if (!browser) {
        return {
          status: 500,
          message: "Failed to launch browser",
          data: null,
        };
      }

      const page = await browser.newPage();

      const response = await page.goto(urlWithProtocol, {
        waitUntil: "networkidle2",
        timeout: 60000, // 60 seconds timeout for page load
      });

      if (!response || !response.ok()) {
        await browser.close();

        return {
          status: 500,
          message: "Failed to load page",
          data: null,
        };
      }

      await page.setRequestInterception(true);
      page.on("request", (req) => {
        if (["image", "stylesheet", "font"].includes(req.resourceType())) {
          req.abort();
        } else {
          req.continue();
        }
      });

      // Check for UI elements on the page (optional)
      const bodyContentExist = await page.evaluate(() => {
        // Check if the body contains any content
        return document.body && document.body.innerHTML.trim().length > 0;
      });

      if (!bodyContentExist) {
        console.error(`No body content found on page: ${url}`);
        await browser.close();
        return {
          status: 500,
          message: `No body content found on page: ${url}`,
          data: null,
        };
      }

      const [screenshot, title, description, ogImage] = await Promise.all([
        page.screenshot(),
        page.title(),
        page
          .$eval('meta[name="description"]', (el) => el.getAttribute("content"))
          .catch(() => ""),
        page
          .$eval('meta[property="og:image"]', (el) =>
            el.getAttribute("content"),
          )
          .catch(() => undefined),
      ]);

      await page.close();

      return {
        status: 200,
        message: "Info fetched successfully",
        data: {
          url: urlWithProtocol,
          screenShot: screenshot,
          title,
          description: description || undefined,
          ogImage: ogImage || undefined,
        },
      };
    } catch (error) {
      console.error("Error generating page info:", error);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    } finally {
      await browser?.close();
      console.timeEnd(`Total execution time crawl info for url: ${url}`);
    }
  }

  async searchSiteLinks({
    domain,
    limit = 10,
  }: ISearchSiteLinks): Promise<IResponse<ISearchSiteLinksResponse | null>> {
    let browser: Browser | null = null;

    console.time(
      `Total execution time search site links for domain: ${domain}`,
    );
    try {
      browser = await puppeteer.launch({
        args: [
          "--hide-scrollbars",
          "--disable-web-security",
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--single-process",
          "--disable-gpu",
          "--disable-software-rasterizer",
          "--disable-dev-shm-usage",
        ],
        executablePath: await chromium.executablePath(
          `https://${process.env.AWS_CDN_HOSTNAME}/chromium/chromium-v123.0.1-pack.tar`,
        ),
        ignoreHTTPSErrors: true,
        headless: true,
      });

      if (!browser) {
        return {
          status: 500,
          message: "Failed to launch browser",
          data: null,
        };
      }

      const page = await browser.newPage();

      const homepage = getUrlWithProtocol(domain);
      const query = `site:${domain}`;
      let currentPage = 1;
      let urls = new Set<string>();

      while (urls.size < limit) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&start=${(currentPage - 1) * 10}`;
        console.log(`Navigating to page ${currentPage}: ${searchUrl}`);

        console.time(`Page ${currentPage} navigation and processing`);
        await page.goto(searchUrl, { waitUntil: "networkidle0" });
        console.log(`Page ${currentPage} loaded`);

        const links = await page.evaluate(
          (homepage, currentLimit) => {
            const uniqueLinks = new Set<string>();

            document.querySelectorAll(".yuRUbf").forEach((element) => {
              if (uniqueLinks.size >= currentLimit) return;

              const linkElement = element.querySelector("a");
              if (linkElement?.href) {
                const url = new URL(linkElement.href);
                url.search = ""; // Remove the query string

                if (url.toString().startsWith(homepage)) {
                  uniqueLinks.add(url.toString());
                }
              }
            });

            console.log(`Found ${uniqueLinks.size} unique links on this page`);
            return Array.from(uniqueLinks);
          },
          homepage,
          limit - urls.size,
        );

        console.timeEnd(`Page ${currentPage} navigation and processing`);

        const newLinksCount = links.length;
        urls = new Set([...Array.from(urls), ...links]);

        console.log(`Page ${currentPage} results:`);
        console.log(`- Found ${newLinksCount} new links`);
        console.log(`- Total unique links so far: ${urls.size}`);
        console.log(
          `- Remaining links to fetch: ${Math.max(0, limit - urls.size)}`,
        );

        if (newLinksCount === 0) {
          console.log("No more results found. Stopping search.");
          break;
        }

        currentPage++;
      }

      await browser.close();

      return {
        status: 200,
        message: "Links fetched successfully",
        data: {
          urls: Array.from(urls).slice(0, limit),
        },
      };
    } catch (error) {
      console.error("Error fetching internal links:", error);
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
        data: null,
      };
    } finally {
      await browser?.close();
      console.timeEnd(
        `Total execution time search site links for domain: ${domain}`,
      );
    }
  }
}

export const crawlService = new CrawlService();
