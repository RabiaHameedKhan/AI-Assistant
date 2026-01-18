import Image from "next/image";
import Link from "next/link";
import BotAnimation from "@/components/BotAnimation";

export default function HomePage() {
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
        <div className="grid max-w-6xl w-full grid-cols-1 md:grid-cols-2 items-center gap-10">
          
          {/* LEFT: Animated Chatbot */}
          <div className="flex justify-start -ml-12 md:-ml-24 lg:-ml-36">
  <BotAnimation />
</div>


          {/* RIGHT: Glass Card */}
          <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-8 shadow-2xl">
            
            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
                <Image
                  src="/avatar.jpg"
                  alt="Neon AI"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
            </div>

            <h1 className="text-3xl font-semibold text-center text-white">
              Neon AI
            </h1>

            <p className="mt-2 text-center text-gray-300">
              Your intelligent assistant for code, ideas, and productivity
            </p>

            <div className="my-6 h-px bg-white/20" />

            {/* CTA */}
            <div className="flex flex-col gap-4">
              <Link
                href="/assistant"
                className="w-full rounded-xl bg-cyan-400 py-3 text-center font-medium text-black hover:bg-cyan-300 transition shadow-lg"
              >
                Launch Assistant
              </Link>

              <Link
                href="/login"
                className="w-full rounded-xl border border-white/30 py-3 text-center font-medium text-white hover:bg-white/10 transition"
              >
                Sign In
              </Link>
            </div>

            <p className="mt-6 text-center text-xs text-gray-400">
              Secure · AI Powered · Built with Next.js
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
