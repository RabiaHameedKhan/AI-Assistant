"use client";

import Image from "next/image";
import { signOut } from "next-auth/react";
interface SidebarProps {
  categories: { label: string }[];
  currentCategory: string;
  setCurrentCategory: (cat: { label: string }) => void;
}

export default function Sidebar({ categories, currentCategory, setCurrentCategory }: SidebarProps) {
  return (
    <div className="w-64 h-full bg-gray-900/90 text-white flex flex-col p-4">

      {/* Full Avatar */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-black">
  <Image
    src="/aavatar.jpg"
    alt="Neon AI"
    width={96}
    height={96}
    className="object-cover"
    priority
  />
</div>
        <h2 className="text-xl font-bold text-cyan-400">Neon AI</h2>
        <p className="text-gray-400 text-sm text-center">Your intelligent assistant</p>
      </div>

      {/* Categories / Modes */}
      <div className="flex flex-col gap-2">
        {categories.map((cat) => (
          <button
            key={cat.label}
            className={`px-4 py-2 rounded-lg text-left ${
              currentCategory === cat.label
                ? "bg-cyan-400 text-black shadow"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
            onClick={() => setCurrentCategory(cat)}
          >
            {cat.label}
          </button>
        ))}
      </div>
<div className="flex-1" />

      {/* Optional: pinned quick actions */}
      <div className="mt-auto">
        <h3 className="text-gray-400 text-sm mb-2">Quick Actions</h3>
        <button 
        onClick={() => signOut({ callbackUrl: "/" })}
        className="w-full bg-gray-800 px-4 py-2 rounded-lg mb-2 hover:bg-gray-700">
          Log Out
        </button>
      </div>
    </div>
  );
}
