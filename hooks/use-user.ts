import { createClient } from "@/lib/supabase/client";
import { User } from "@/lib/types";
import React, { useEffect } from "react";

const useUser = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const supabase = createClient();
    const fetchUser = async () => {
      try {
        setLoading(true);

        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) return console.log("No auth user");

        // get user from db whose email matches authUser.email
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("email", authUser.email)
          .single();

        if (!userData) return console.log("No user data");
        setUser(userData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { loading, user };
};

export default useUser;
