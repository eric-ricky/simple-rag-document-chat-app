"use client";

import { Button } from "@/components/ui/button";
import useUser from "@/hooks/use-user";
import { Document } from "@/lib/types";
import axios from "axios";
import { FileText, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const ProcessDocument = ({ file }: { file?: Document }) => {
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleProcessDocument = async () => {
    if (!file || !user) return;

    setIsLoading(true);

    try {
      const response = await axios.post("/api/process-document", {
        fileName: file.name,
        userId: user.id,
      });

      if (response.status !== 200) {
        throw new Error("Failed to process document");
      }

      toast.success("Document processed successfully");
      location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold">Prepare Document</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Process your document to start chatting <br /> (Might take a while)
        </p>
        <Button
          onClick={handleProcessDocument}
          className="mt-4"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="size-4 mr-2 animate-spin" />}
          {isLoading ? "Processing..." : "Start Chat"}
        </Button>
      </div>
    </div>
  );
};

export default ProcessDocument;
