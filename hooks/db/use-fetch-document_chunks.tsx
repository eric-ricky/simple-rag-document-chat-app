import { createClient } from "@/lib/supabase/client";
import { Document } from "@/lib/types";
import { useEffect, useState } from "react";

const useFetchDocumentChunks = (documentId: string) => {
  const [chunks, setChunks] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchChunks = async () => {
      try {
        const supabase = createClient();
        setIsLoading(true);

        const { data: chunks, error } = await supabase
          .from("document_chunks")
          .select("*")
          .eq("document_id", documentId)
          .limit(1);

        if (error) throw error;

        console.log("chunks", chunks);

        setChunks(chunks);

        setIsLoading(false);
      } catch (error) {
        console.log("error fetching chunks", error);
        setError(error as Error);
        setIsLoading(false);
      }
    };
    fetchChunks();
  }, [documentId]);

  return {
    chunks,
    isLoading,
    error,
  };
};

export default useFetchDocumentChunks;
