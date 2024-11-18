"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import useFetchFiles from "@/hooks/db/use-fetch-files";
import { useSidebar } from "@/hooks/use-sidebar";
import { createClient } from "@/lib/supabase/client";
import { Folder, Folder as IFolder } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  FileText,
  Folder as FolderIcon,
  Trash,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

interface FolderItemProps {
  folder: IFolder;
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
}

const FolderItem = ({ folder, setFolders }: FolderItemProps) => {
  const supabase = createClient();

  const { toggle: toggleSidebar } = useSidebar();

  const { files, isLoading } = useFetchFiles(folder.id);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(folder.name);

  const [isExpanded, setIsExpanded] = useState(false);

  const handleUpdateFolder = async () => {
    try {
      // optimistic update
      setFolders((prev) =>
        prev.map((f) => (f.id === folder.id ? { ...f, name: title } : f))
      );

      const { error } = await supabase
        .from("folders")
        .update({ name: title })
        .eq("id", folder.id);

      if (error) throw error;
      setIsEditing(false);
      toast.success("Folder updated successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleDeleteFolder = async (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    event.stopPropagation();
    try {
      // optimistic update
      setFolders((prev) => prev.filter((f) => f.id !== folder.id));

      const { error } = await supabase
        .from("folders")
        .delete()
        .eq("id", folder.id);
      if (error) throw error;
      toast.success("Folder deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Button
        variant="ghost"
        className="group w-full flex items-center justify-start px-1 py-0"
        onClick={() => !isEditing && setIsEditing(true)}
      >
        <div role="button" onClick={handleExpand}>
          <FolderIcon className="mr-2 size-4" />
        </div>

        <div className="h-8 flex-1 flex items-center">
          {isEditing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleUpdateFolder}
              autoFocus
              disabled={!isEditing}
              className="h-6 w-full bg-transparent px-2 focus-visible:ring-1 focus-visible:ring-offset-0 border-2 outline-none shadow-none ring-0 rounded-md"
            />
          ) : (
            <span className="flex text-sm">{folder.name}</span>
          )}
        </div>

        <Trash
          role="button"
          onClick={handleDeleteFolder}
          className="hidden group-hover:block size-4 text-muted-foreground"
        />
      </Button>

      {isExpanded && (
        <div className="space-y-2">
          <p
            style={{
              paddingLeft: "12px",
            }}
            className="hidden last:block text-sm font-medium text-muted-foreground/80"
          >
            No files in this folder.
          </p>

          {isLoading &&
            Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-full" />
            ))}

          {!isLoading &&
            files.map((file) => (
              <Link
                key={file.id}
                href={`/chat/${file.id}`}
                onClick={() => toggleSidebar()}
                style={{
                  paddingLeft: "12px",
                }}
                className={cn(
                  "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium"
                )}
              >
                <FileText className="mr-2 size-4 text-orange-500" />

                <span className="max-w-[150px] truncate">{file.label}</span>

                <ChevronRight className="hidden group-hover:block size-4 ml-auto" />
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default FolderItem;
