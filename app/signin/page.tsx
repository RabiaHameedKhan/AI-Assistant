"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      
      {/* Background */}
      <Image
        src="/hero-bg.jpg"
        alt="AI Background"
        fill
        priority
        className="object-cover scale-105 blur-lg"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md">
          
          {/* Glass Card */}
          <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-8 shadow-2xl">

            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center shadow-lg">
                <Image
                  src="/aavatar.jpg"
                  alt="Neon AI"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-semibold text-center text-white">
              Welcome 
            </h1>

            <p className="mt-2 text-center text-gray-300">
              Sign in to continue with Neon AI
            </p>

            <div className="my-6 h-px bg-white/20" />

            {/* Google Sign In */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/assistant" })}
              className="w-full rounded-xl bg-cyan-400 py-3 text-center font-medium text-black hover:bg-cyan-300 transition shadow-lg"
            >
              Continue with Google
            </button>

            {/* Back link */}
            <Link
              href="/"
              className="mt-4 block text-center text-sm text-gray-400 hover:text-white transition"
            >
              ← Back to Home
            </Link>

            <p className="mt-6 text-center text-xs text-gray-400">
              Secure · Google Auth · Neon AI
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
