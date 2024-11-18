import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { ChatPageContent } from "./_components/content";

const ChatPage = async ({ params }: { params: { documentId: string } }) => {
  const supabase: SupabaseClient<any, "public", any> = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <ChatPageContent params={params} />;
};

export default ChatPage;
