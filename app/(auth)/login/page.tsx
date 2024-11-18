import SignInCard from "@/components/auth/sign-in-card";
import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export default async function Login() {
  const supabase: SupabaseClient<any, "public", any> = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return <SignInCard />;
}
