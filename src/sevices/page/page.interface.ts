export interface ICreatePage {
  url: string;
  siteId: string;
}

export interface IGetPageBy {
  url?: string;
  siteId?: string;

  id?: string;
}

export interface IDeleteManyPageBy {
  siteId?: string;

  id?: string;
}

export interface IPageDetail {
  id: string;
  url: string;
  siteId: string;
  OGImage?: string;
  OGTitle?: string;
  OGDescription?: string;

  createdAt: Date;
  updatedAt: Date;
}
