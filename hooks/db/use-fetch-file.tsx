import { createClient } from "@/lib/supabase/client";
import { Document } from "@/lib/types";
import { useEffect, useState } from "react";

const useFetchFile = (fileId: string) => {
  const [file, setFile] = useState<Document>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const supabase = createClient();
        setIsLoading(true);

        const { data, error } = await supabase
          .from("documents")
          .select("*")
          .eq("id", fileId)
          .single();
        if (error) throw error;

        setFile(data);

        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setError(error as Error);
        setIsLoading(false);
      }
    };
    fetchFile();
  }, [fileId]);

  return {
    file,
    isLoading,
    error,
  };
};

export default useFetchFile;
