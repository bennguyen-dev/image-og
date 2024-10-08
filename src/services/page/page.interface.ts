import { IOGImageDetail } from "@/services/ogImage";

export interface ICreatePage {
  url: string;
  siteId: string;
}

export interface IGetPageBy {
  url?: string;
  siteId?: string;

  id?: string;
}

export interface IUpdatePagesBy {
  id?: string;
  siteId?: string;
  cacheDurationDays?: number;
}

export interface IDeletePagesBy {
  siteId?: string;

  id?: string;
}

export interface IPageDetail {
  id: string;
  url: string;
  siteId: string;
  cacheDurationDays?: number;
  OGImage?: IOGImageDetail;
  OGTitle?: string;
  OGDescription?: string;

  createdAt: Date;
  updatedAt: Date;
}
