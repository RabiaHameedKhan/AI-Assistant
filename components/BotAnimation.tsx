"use client";

import Lottie from "lottie-react";
import botAnimation from "@/public/ai-bot.json";

export default function BotAnimation() {
  return (
    <div className="w-[380px] md:w-[480px] lg:w-[520px] drop-shadow-[0_0_60px_rgba(0,255,255,0.35)]">
      <Lottie animationData={botAnimation} loop />
    </div>
  );
}
