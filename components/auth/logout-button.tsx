"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "../ui/button";
import useUser from "@/hooks/use-user";
import { cn } from "@/lib/utils";

const LogoutButton = ({ className }: { className?: string }) => {
  const { user } = useUser();

  const handleLogout = async () => {
    if (!user) return;

    const supabase = createClient();
    await supabase.auth.signOut();
    location.reload();
  };
  return (
    <Button onClick={handleLogout} className={cn(className)}>
      Log Out
    </Button>
  );
};

export default LogoutButton;
