"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useUser from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const UserNav = () => {
  const { user } = useUser();
  const supabase = createClient();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    router.refresh();
    setIsLoading(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user?.avatar_url || "https://github.com/shadcn.png"}
              alt={user?.full_name!}
            />
            <AvatarFallback>
              {user?.full_name
                ? user?.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : "AB"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user?.avatar_url || "https://github.com/shadcn.png"}
              alt={user?.full_name!}
            />
            <AvatarFallback>
              {user?.full_name
                ? user?.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : "AB"}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.full_name || "--"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || "--"}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <Button
          variant="ghost"
          className="w-full"
          onClick={handleSignOut}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          Log Out
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
