import {
  IGetAllUrlByDomain,
  IGetAllUrlByDomainResponse,
  IGetInfoByUrl,
  IGetInfoByUrlResponse,
} from "@/sevices/crawl";
import { getUrlWithProtocol } from "@/lib/utils";
import puppeteer from "puppeteer";
import { IResponse } from "@/lib/type";

class CrawlService {
  async getInfoByUrl({
    url,
  }: IGetInfoByUrl): Promise<IResponse<IGetInfoByUrlResponse | null>> {
    const verifiedUrl = getUrlWithProtocol(url);

    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Set viewport size
      await page.setViewport({ width: 1280, height: 800 });

      const response = await page.goto(verifiedUrl, {
        waitUntil: "networkidle2",
        timeout: 60000,
      }); // Set timeout to 60 seconds

      // Check if the response status is okay (2xx or 3xx)
      if (!response || !response.ok()) {
        console.error(`Error loading page: ${url}`);
        await browser.close();
        return {
          status: 500,
          message: `Error loading page: ${url}`,
          data: null,
        };
      }

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

      // Capture screenshot
      const screenshot = await page.screenshot();

      // Get title and description, og:image
      const title = await page.title();
      const description = await page.evaluate(() => {
        const metaDescription = document.querySelector(
          'meta[name="description"]',
        );
        return metaDescription ? metaDescription.getAttribute("content") : "";
      });

      const image = await page.evaluate(() => {
        const ogImage = document.querySelector('meta[property="og:image"]');
        return ogImage ? ogImage.getAttribute("content") : null;
      });

      // Close page and browser after capturing screenshot
      await page.close();
      await browser.close();

      return {
        status: 200,
        message: "Info fetched successfully",
        data: {
          url: verifiedUrl,
          screenShot: screenshot,
          title,
          description: description || undefined,
          ogImage: image || undefined,
        },
      };
    } catch (error) {
      console.error("Error generating OG image:", error);
      return {
        status: 500,
        message: "Internal Server Error",
        data: null,
      };
    }
  }

  async getAllUrlByDomain({
    domain,
    limit = 4,
  }: IGetAllUrlByDomain): Promise<
    IResponse<IGetAllUrlByDomainResponse | null>
  > {
    const homepage = getUrlWithProtocol(domain);

    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(homepage, { waitUntil: "networkidle2", timeout: 30000 });

      const links = await page.evaluate(() => {
        const anchorElements = document.querySelectorAll("a");
        return Array.from(anchorElements).map((anchor) => anchor.href);
      });

      await browser.close();

      return {
        status: 200,
        message: "Links fetched successfully",
        data: {
          urls: this._selectImportantPages(links, homepage).slice(0, limit),
        },
      };
    } catch (error) {
      console.error("Error fetching internal links:", error);
      return {
        status: 500,
        message: "Internal Server Error",
        data: null,
      };
    }
  }

  _selectImportantPages(links: string[], homepage: string) {
    const importantPages = new Set([homepage]);
    const priorityPages = [
      "about",
      "contact",
      "services",
      "products",
      "blog",
      "faq",
      "sitemap",
      "privacy",
      "terms",
      "refund",
      "payment",
      "shipping",
      "pricing",
      "checkout",
      "business",
      "investor",
      "newsroom",
    ];

    links.forEach((link) => {
      if (priorityPages.some((page) => link.includes(page))) {
        importantPages.add(link);
      }
    });

    return Array.from(importantPages);
  }
}

export const crawlService = new CrawlService();