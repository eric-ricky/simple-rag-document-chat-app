import { createClient } from "@/lib/supabase/client";
import { Folder } from "@/lib/types";
import { useEffect, useState } from "react";

const useFetchFolders = (refresh?: boolean) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const supabase = createClient();
        setIsLoading(true);

        // sort by created_at
        const { data: folders, error } = await supabase
          .from("folders")
          .select("*")
          .order("created_at", { ascending: true });
        console.log("folders", folders);
        if (error) throw error;

        setFolders(folders);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setError(error as Error);
        setIsLoading(false);
      }
    };
    fetchFolders();
  }, [refresh]);

  return {
    folders,
    isLoading,
    error,
  };
};

export default useFetchFolders;
