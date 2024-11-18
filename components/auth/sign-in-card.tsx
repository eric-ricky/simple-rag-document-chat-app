"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { PasswordInput } from "../ui/password-input";

const SignInFormSchema = z.object({
  email: z.string().describe("Email").email({ message: "Enter a valid email" }),
  password: z
    .string()
    .describe("Password")
    .min(6, "Password must be a minimum of 6 characters"),
});

const SignInCard = () => {
  const { toast } = useToast();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof SignInFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(SignInFormSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof SignInFormSchema>) => {
    try {
      setErrorMessage(null);

      const { email, password } = values;
      if (!email || !password) throw new Error("Please fill all the fields");

      const supabase = createClient();

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log("SIGNUP ERROR ===>", signInError);
      if (signInError) throw new Error(signInError.message);

      toast({
        title: "Login successfully",
        variant: "default",
      });
      form.reset();
      location.reload();
    } catch (error) {
      setErrorMessage((error as Error).message);
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const {
    formState: { isSubmitting },
  } = form;

  return (
    <div className="bg-card px-4 py-8 shadow sm:rounded-lg sm:px-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            disabled={isSubmitting}
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="email">Email address</Label>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email"
                    autoComplete="email webauthn"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            disabled={isSubmitting}
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="password">Password</Label>
                <FormControl>
                  <PasswordInput
                    placeholder="Password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader className="size-4 mr-2 animate-spin" />}
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </div>
          {errorMessage && (
            <Alert variant="destructive" className="relative">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>

              <div className="absolute right-2 top-2 cursor-pointer">
                <X className="size-4 " onClick={() => setErrorMessage(null)} />
              </div>
            </Alert>
          )}

          <p>
            Don&apos;t have an account?{" "}
            <Link href={"/signup"} className="text-blue-600">
              &nbsp;Create Account
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default SignInCard;
