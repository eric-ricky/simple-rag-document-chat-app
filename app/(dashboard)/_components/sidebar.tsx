"use client";

import { Separator } from "@/components/ui/separator";
import { UserNav } from "@/components/user-nav";
import { useSidebar } from "@/hooks/use-sidebar";
import useUser from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import { FileText, Home, Star } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderList } from "./folder-list";

const Sidebar = () => {
  const { user } = useUser();
  const { isOpen: isSidebarOpen, toggle: toggleSidebar } = useSidebar();

  const pathname = usePathname();

  const routes = [
    {
      title: "Home",
      icon: <Home className="mr-2 h-4 w-4" />,
      path: "/dashboard",
    },
    {
      title: "Favorites",
      icon: <Star className="mr-2 h-4 w-4" />,
      path: "/favorites",
    },
  ];

  return (
    <div
      className={`z-[999] ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}
    >
      <div className="flex flex-col h-full p-4">
        {/* logo with icon and title */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <FileText className="size-5" />
          <h2 className="text-2xl font-bold">DocuChat</h2>
        </Link>

        <Separator className="my-4" />

        <div className="space-y-1 pb-2">
          {routes.map((doc) => (
            <Link
              key={doc.title}
              href={doc.path}
              onClick={() => toggleSidebar()}
              className={cn(
                "inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full justify-start px-1 py-2 h-10 hover:bg-accent hover:text-accent-foreground",
                pathname === doc.path && "bg-primary/5 text-primary"
              )}
            >
              {doc.icon} {doc.title}
            </Link>
          ))}
        </div>

        <Separator className="my-4" />

        <FolderList />

        <Separator className="my-4" />

        <div className="py-2 flex items-center gap-2">
          <UserNav />
          <div className="flex flex-col">
            <span className="text-sm font-medium truncate max-w-28">
              {user?.full_name || "--"}
            </span>
            <span className="text-sm font-medium truncate max-w-44">
              {user?.email || "--"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
