"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface Tip {
  id: number;
  title: string;
  icon: string;
  category: string;
  explanation: string;
}

function ShimmerCard() {
  return (
    <Card className="w-full bg-gray-800/40 border border-gray-700 rounded-2xl shadow-lg animate-pulse">
      <CardContent className="p-5 flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex items-start gap-4 w-full">
          <div className="w-12 h-12 bg-gray-700 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-700 rounded w-2/3" />
            <div className="h-3 bg-gray-700 rounded w-full" />
            <div className="h-3 bg-gray-700 rounded w-4/5" />
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="h-3 bg-gray-700 rounded w-16" />
          <div className="h-8 bg-gray-700 rounded-lg w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function AiTipsCardPage() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("aiTips");

    if (!stored) {
      router.replace("/profilecard"); // redirect if nothing in storage
      return;
    }

    try {
      const parsed = JSON.parse(stored);

      // Validate that parsed.tips exists and is an array
      if (
        !parsed?.tips ||
        !Array.isArray(parsed.tips) ||
        parsed.tips.length === 0
      ) {
        console.warn("No tips array found in localStorage, redirecting...");
        router.replace("/profilecard");
        return;
      }

      setTips(parsed.tips);
    } catch (err) {
      console.error("Error parsing stored tips:", err);
      router.replace("/profilecard");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleSave = (tip: Tip) => {
    const saved = JSON.parse(localStorage.getItem("savedTips") || "[]");

    // Only save if tip with same title & explanation doesn't exist
    const exists = saved.some(
      (t: Tip) => t.title === tip.title && t.explanation === tip.explanation
    );

    if (!exists) {
      saved.push(tip);
      localStorage.setItem("savedTips", JSON.stringify(saved));
    }

    router.push("/my-saves");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-950 text-white flex flex-col items-center p-6 font-sans">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">
        ✨ Your Personalized Board
      </h1>

      <div className="w-full max-w-6xl">
        <div
          className="flex flex-col gap-6 max-h-[80vh] overflow-y-auto overflow-x-hidden pr-2
                        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        >
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <ShimmerCard key={i} />)
            : tips.map((tip) => (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="w-full cursor-pointer"
                  onClick={() => router.push(`/aitips/${tip.id}`)}
                >
                  <Card className="w-full bg-gray-800/70 border border-gray-700 rounded-2xl shadow-lg hover:border-purple-500 transition">
                    <CardContent className="p-5 flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex items-start gap-4">
                        <span className="text-4xl mt-1">{tip.icon}</span>
                        <div>
                          <h2 className="text-lg md:text-xl font-semibold">
                            {tip.title}
                          </h2>
                          <p className="mt-2 text-sm md:text-base text-gray-300">
                            {tip.explanation}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full md:w-auto mt-4 md:mt-0 gap-4">
                        <span className="text-xs md:text-sm text-purple-400">
                          {tip.category}
                        </span>
                        <button
                          className="px-3 py-1 bg-purple-600 rounded-lg text-white text-xs md:text-sm hover:bg-purple-500 transition"
                          onClick={(e) => {
                            e.stopPropagation(); // prevent triggering parent click
                            handleSave(tip);
                          }}
                        >
                          Save
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </div>
      </div>
    </div>
  );
}
