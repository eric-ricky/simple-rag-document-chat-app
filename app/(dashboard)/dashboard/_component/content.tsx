"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFileUploadModal } from "@/hooks/modal-state/use-file-upload-modal";
import { createClient } from "@/lib/supabase/client";
import { FileText, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DocumentStats {
  total_documents: number;
  total_chats: number;
  recent_activity: {
    date: string;
    action: string;
    document: string;
    document_id: string;
  }[];
}

const DashboardPageContent = () => {
  const { onOpen: openUploadModal } = useFileUploadModal();
  const [stats, setStats] = useState<DocumentStats>({
    total_documents: 0,
    total_chats: 0,
    recent_activity: [],
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const { data: documents } = await supabase
          .from("documents")
          .select("*")
          .eq("user_id", user.id);

        console.log("DOCUMENTS ===>", documents);

        const { data: chats } = await supabase
          .from("chats")
          .select("*")
          .eq("user_id", user.id);

        setStats({
          total_documents: documents?.length || 0,
          total_chats: chats?.length || 0,
          recent_activity:
            documents?.slice(0, 5).map((doc) => ({
              date: new Date(doc.created_at).toLocaleDateString(),
              action: "Uploaded",
              document: doc.name,
              document_id: doc.id,
            })) || [],
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-12 rounded-full bg-muted mx-auto" />
          <div className="h-4 w-32 rounded bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Documents</h2>
        <Button size="sm" onClick={openUploadModal}>
          <Plus className="size-4 md:mr-2" />
          <span className="hidden md:block">Upload Document</span>
        </Button>
      </div>

      {stats.total_documents === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 text-sm font-medium text-muted-foreground/80 text-center p-10">
          <Image
            src="/images/empty.png"
            alt="empty folder"
            width={200}
            height={200}
          />

          <p>Upload your first document to get started</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border rounded-md border">
              {stats.recent_activity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center space-x-4">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {activity.document.split("-").pop()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Uploaded on {activity.date}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" asChild>
                    <Link href={`/chat/${activity.document_id}`}>Chat</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardPageContent;
