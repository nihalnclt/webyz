"use client";

import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";

export default function LoginPageView() {
  return (
    <div className="w-full max-w-[400px] mx-auto px-6">
      <h1 className="text-2xl font-semibold text-center">Welcome To Webyz</h1>
      <span className="block text-center">
        Enter your credentials to continue.
      </span>

      <div>
        <Input
          onChange={() => {}}
          label="Email"
          placeHolder="Ex: example@gmail.com"
        />
      </div>
      <div className="mt-4">
        <Input onChange={() => {}} label="Password" />
      </div>
      <div className="flex justify-end mt-2">
        <span className="text-[13px] text-accentPrimary">
          Forgort password?
        </span>
      </div>

      <div className="mt-4">
        <Button className="w-full">Login</Button>
      </div>
    </div>
  );
}
