import { Product } from "@prisma/client";

import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CardCredit, CardProducts } from "@/modules/credits";

interface IProps {
  products: Product[];
}

const ListCredit = ({ products }: IProps) => {
  return (
    <>
      <div className="p-4 sm:p-6">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard/sites">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Credits</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-4 flex flex-col gap-4 sm:mb-6 sm:gap-6">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
            <CardCredit />
          </div>
          {products && <CardProducts products={products} />}
        </div>
      </div>
    </>
  );
};

export default ListCredit;
