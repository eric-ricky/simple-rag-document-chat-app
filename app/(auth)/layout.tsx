"use client";

import { FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { PropsWithChildren } from "react";

const AuthLayout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  return (
    <section className="min-h-screen relative">
      <Image
        src={"/images/students1.webp"}
        alt="."
        fill
        className="object-cover"
      />

      {/* absolute div to cover the whole parent element */}
      <div className="absolute inset-0 bg-black/40 flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href={"/"} className="flex justify-center">
            <FileText className="h-12 w-12 text-slate-200" />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-100">
            {pathname === "/login"
              ? "Sign in to DocuChat AI"
              : "Create a New Account"}
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">{children}</div>
      </div>
    </section>
  );
};

export default AuthLayout;
