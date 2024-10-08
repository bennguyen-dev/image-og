import { ReactNode } from "react";

import { SessionProvider } from "next-auth/react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

interface IProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: IProps) {
  return (
    <SessionProvider>
      <Header />
      <main className="flex min-h-screen flex-col items-center overflow-x-clip pt-16 sm:pt-16">
        {children}
      </main>
      <Footer />
    </SessionProvider>
  );
}
