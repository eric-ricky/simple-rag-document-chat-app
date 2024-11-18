"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import useFetchFolders from "@/hooks/db/use-fetch-folders";
import useUser from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { Folder } from "@/lib/types";
import { Loader2, Plus, RefreshCcw } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import FolderItem from "./folder-item";

export const FolderList = () => {
  const { user } = useUser();
  const [refresh, setRefresh] = useState(false);
  const { folders: data, isLoading } = useFetchFolders(refresh);
  const [folders, setFolders] = useState<Folder[]>(data || []);
  const [isAddingFolder, setIsAddingFolder] = useState(false);

  useEffect(() => {
    setFolders(data || []);
  }, [data]);

  const handleAddFolder = async () => {
    if (!user) return;

    const toastId = toast.loading("Creating folder...");

    try {
      setIsAddingFolder(true);
      const tempFolder: Folder = {
        created_at: new Date().toISOString(), // match supabase timestamp format
        id: crypto.randomUUID(),
        name: "Untitled",
        user_id: user.id,
      };
      setFolders([...folders, tempFolder]);

      const supabase = createClient();

      const { error } = await supabase
        .from("folders")
        .insert({
          ...tempFolder,
        })
        .select();

      if (error) throw error;
      toast.success("Folder created successfully", { id: toastId });
    } catch (error) {
      console.log(error);
      toast.error("Failed to create folder", { id: toastId });
    } finally {
      setIsAddingFolder(false);
    }
  };

  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Folders</h2>

        <div className="flex items-center">
          <Button
            onClick={handleRefresh}
            disabled={!user || isAddingFolder}
            variant="ghost"
            className="size-8 p-0 h-fit"
          >
            <RefreshCcw className="size-4 text-muted-foreground" />
          </Button>

          <Button
            onClick={handleAddFolder}
            disabled={!user || isAddingFolder}
            variant="ghost"
            className="size-8 p-1.5"
          >
            {isAddingFolder ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Plus className="size-5 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-grow max-h-[calc(100vh-10rem)]">
        <div className="space-y-2 pt-4 pb-10">
          <div className="space-y-1">
            {/* no folders message */}
            <div className="hidden last:flex flex-col items-center justify-center gap-2 text-sm font-medium text-muted-foreground/80 text-center p-10">
              <Image
                src="/images/empty.png"
                alt="empty folder"
                width={120}
                height={120}
              />

              <p>You have not created any folders yet.</p>
            </div>

            {/* folders loading skeleton */}
            {isLoading &&
              Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-full" />
              ))}

            {/* folders */}
            {!isLoading &&
              folders?.map((folder, index) => (
                <FolderItem
                  key={index}
                  folder={folder}
                  setFolders={setFolders}
                />
              ))}
          </div>
        </div>
      </ScrollArea>
    </>
  );
};
