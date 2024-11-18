import { createClient } from "@/lib/supabase/client";
import { Document } from "@/lib/types";
import { useEffect, useState } from "react";

const useFetchFiles = (folderId: string) => {
  const [files, setFiles] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const supabase = createClient();
        setIsLoading(true);

        const { data: files, error } = await supabase
          .from("documents")
          .select("*")
          .eq("folder_id", folderId)
          .order("created_at", { ascending: true });
        if (error) throw error;

        setFiles(files);

        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setError(error as Error);
        setIsLoading(false);
      }
    };
    fetchFiles();
  }, [folderId]);

  return {
    files,
    isLoading,
    error,
  };
};

export default useFetchFiles;
