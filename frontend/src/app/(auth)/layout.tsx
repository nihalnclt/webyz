import { Button } from "@/components/shared/Button";
import Link from "next/link";
import React from "react";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-[100vh] flex flex-col">
      <div className="container flex items-center justify-between h-[70px]">
        <Link href={`/`} className="flex items-center gap-2 text-lg">
          <img src="/images/logo.png" className="w-[20px] h-[20px]" />
          <span className="font-bold">Webyz</span>
        </Link>

        <div className="flex items-center gap-4">
          <span>Don't have an account?</span>
          <Link href={`/signup`}>
            <Button>Signup</Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center flex-1">{children}</div>

      <div className="text-center">
        <nav className="block">
          <ul className="flex items-center justify-center gap-5 text-xs list-disc">
            <li>Webyz.io</li>
            <li>Support</li>
            <li>Developers & API</li>
            <li>Features</li>
            <li>Pricing</li>
            <li>Terms</li>
            <li>Privacy</li>
          </ul>
        </nav>
        <span className="text-xs">
          This site is protected by reCAPTCHA and the Google{" "}
          <span className="underline">Privacy Policy</span> and
          <span className="underline">Terms of Service</span> apply.
        </span>
      </div>
    </div>
  );
}
