import { Page } from "@prisma/client";

import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { pageService } from "@/services/page";
import { getImageLinkFromAWS } from "@/utils";

export const GET = auth(async function GET(req, res) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({
      message: "Unauthorized",
      status: 401,
      data: null,
    });
  }

  const siteId = res?.params?.siteId as string;

  if (!siteId) {
    return NextResponse.json({
      message: "Site ID is required",
      status: 400,
      data: null,
    });
  }

  const pages = await pageService.getAllBy({ siteId });

  if (!pages.data) {
    return NextResponse.json(pages, { status: pages.status });
  }

  const data: Page[] = pages.data.map((page) => ({
    ...page,
    imageSrc: page.imageSrc ? getImageLinkFromAWS(page.imageSrc) : null,
  }));

  return NextResponse.json({ ...pages, data }, { status: pages.status });
});
