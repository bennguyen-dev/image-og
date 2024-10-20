import { SquareMousePointer } from "lucide-react";

import { NavItem } from "@/lib/type";

export const ROUTES = [
  {
    name: "Demo",
    path: "/demo",
    auth: false,
  },
  {
    name: "Pricing",
    path: "/pricing",
    auth: false,
  },
  {
    name: "How it works",
    path: "/#how-it-works",
    auth: false,
  },
  {
    name: "FAQs",
    path: "/#faqs",
    auth: false,
  },
];

export const navItems: NavItem[] = [
  // {
  //   title: "Dashboard",
  //   href: "/dashboard",
  //   icon: <LayoutDashboard className="size-5" />,
  //   label: "Dashboard",
  // },
  {
    title: "Sites",
    href: "/dashboard/sites",
    icon: <SquareMousePointer className="size-5" />,
    label: "Sites",
  },
  // {
  //   title: "Subscription",
  //   href: "/dashboard/subscription",
  //   icon: <ReceiptText className="size-5" />,
  //   label: "Subscription",
  // },
];

export const CACHE_DURATION_DAYS = 30;

export const DURATION_CACHES = Array(CACHE_DURATION_DAYS)
  .fill(null)
  .map((_, i) => ({ value: `${i + 1}`, label: `${i + 1} days` }));

export const IMAGE_TYPES = Object.freeze({
  PNG: {
    MIME: "image/png",
    EXTENSION: "png",
  },
  JPEG: {
    MIME: "image/jpeg",
    EXTENSION: "jpg",
  },
});
