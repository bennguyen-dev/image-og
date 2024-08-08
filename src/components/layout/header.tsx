import Link from "next/link";
import { redirect } from "next/navigation";

import { auth, signOut } from "@/auth";
import { MobileNavbar } from "@/components/layout/mobile-navbar";
import { Navbar } from "@/components/layout/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const Header = async () => {
  const session = await auth();

  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-card/90 text-card-foreground shadow-sm backdrop-blur">
      <div className="container mx-auto flex items-center justify-between rounded-md bg-transparent py-3">
        <div className="hidden md:flex">
          <Link className="flex items-center space-x-2" href="/">
            <span className="hidden text-xl font-bold sm:inline-block">
              Smart OG
            </span>
          </Link>
        </div>

        <MobileNavbar session={session} />
        <Navbar session={session} />

        {session?.user ? (
          <div className="flex items-center gap-4">
            <div className="flex cursor-pointer flex-col items-end">
              <p className="text-base">{session.user.name}</p>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                  redirect("/");
                }}
              >
                <button
                  type="submit"
                  className="text-sm font-semibold underline"
                >
                  Logout
                </button>
              </form>
            </div>
            <Avatar>
              <AvatarImage
                src={session.user.image as string}
                alt="User Image"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <div className="flex items-center justify-between space-x-2 md:justify-end">
            <form
              action={async () => {
                "use server";
                redirect("/signin");
              }}
            >
              <Button type="submit">Sign in</Button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};
