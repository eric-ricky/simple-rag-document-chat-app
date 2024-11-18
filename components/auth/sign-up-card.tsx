"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Loader, MailCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { PasswordInput } from "../ui/password-input";
import { createClient } from "@/lib/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const SignupFormSchema = z
  .object({
    email: z
      .string()
      .describe("Email")
      .email({ message: "Enter a valid email" }),
    password: z
      .string()
      .describe("Password")
      .min(6, "Password must be a minimum of 6 characters"),
    confirmPassword: z
      .string()
      .describe("Confirm Password")
      .min(6, "Password must be a minimum of 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const SignUpCard = () => {
  const { toast } = useToast();
  const [confirmationSent, setConfirmationSent] = useState(false);

  const form = useForm<z.infer<typeof SignupFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(SignupFormSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: z.infer<typeof SignupFormSchema>) => {
    try {
      const { email, password, confirmPassword } = values;
      if (!email || !password || !confirmPassword)
        throw new Error("Please fill all the fields");
      if (password !== confirmPassword)
        throw new Error("Passwords don't match");

      const supabase = createClient();

      // check if user already exists
      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("email", email);
      if (existingUser && existingUser.length > 0)
        throw new Error("User already exists with this email");

      // create user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/api/auth/callback`,
        },
      });
      console.log("DATA ===>", data);
      console.log("SIGNUP ERROR ===>", signUpError);
      if (signUpError) throw new Error(signUpError.message);

      setConfirmationSent(true);
      // toast.success("Confirmation email sent. Please check your inbox.", {
      //   duration: 5000,
      // });
      toast({
        title: "Confirmation email sent. Please check your inbox.",
        description: "You will be redirected to the login page in 5 seconds.",
        variant: "default",
      });
      form.reset();
    } catch (error) {
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

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const { error } = await supabase.auth.signInWithPassword({
  //       email,
  //       password,
  //     });

  //     if (error) throw error;

  //     router.push("/");
  //     router.refresh();
  //   } catch (error: any) {
  // toast({
  //   title: "Error",
  //   description: error.message,
  //   variant: "destructive",
  // });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="bg-card px-4 py-8 shadow sm:rounded-lg sm:px-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {!confirmationSent && (
            <>
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

              <FormField
                disabled={isSubmitting}
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <FormControl>
                      <PasswordInput
                        placeholder="Confirm Password"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <Loader className="size-4 mr-2 animate-spin" />
                  )}
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </Button>
              </div>
            </>
          )}

          <p>
            Already have an account?{" "}
            <Link href={"/login"} className="text-blue-600">
              &nbsp;Sign In
            </Link>
          </p>

          {confirmationSent && (
            <>
              <Alert className={"bg-primary text-slate-100"}>
                <MailCheck color="white" className="h-4 w-4 text-slate-50" />

                <AlertTitle>Check your email </AlertTitle>
                <AlertDescription>
                  An email confirmation has been sent.
                </AlertDescription>
              </Alert>
            </>
          )}
        </form>
      </Form>
    </div>
  );
};

export default SignUpCard;
