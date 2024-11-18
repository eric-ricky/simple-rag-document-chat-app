"use client";

import { Button } from "@/components/ui/button";
import { useFileUploadModal } from "@/hooks/modal-state/use-file-upload-modal";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { Menu, Upload } from "lucide-react";

const Header = () => {
  const { toggle: toggleSidebar, isOpen } = useSidebar();
  const { onOpen } = useFileUploadModal();

  return (
    <>
      <header className="flex items-center justify-between p-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>

        <Button variant={"outline"} onClick={onOpen} className="ml-auto">
          <Upload className="size-4" />
        </Button>
      </header>

      {/* overlay when sidebar is open */}
      <div
        onClick={toggleSidebar}
        className={cn(
          "fixed inset-0 bg-black/50 lg:hidden z-50",
          !isOpen && "hidden"
        )}
      />
    </>
  );
};

export default Header;
