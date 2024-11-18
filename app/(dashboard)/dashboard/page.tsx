import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import DashboardPageContent from "./_component/content";

const Dashboard = async () => {
  const supabase: SupabaseClient<any, "public", any> = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <DashboardPageContent />;
};

export default Dashboard;
