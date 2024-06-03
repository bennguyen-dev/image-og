import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { pageService } from "@/sevices/page";

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

  return NextResponse.json(pages, { status: pages.status });
});
