"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Sign in to Cinema Guru</h1>
      <button
        onClick={() => signIn("github", { callbackUrl: "/" })}
        className="px-4 py-2 bg-gray-800 text-white rounded"
      >
        Sign in with GitHub
      </button>
    </div>
  );
}
