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
      // No tips found → redirect to profile page
      console.log("called");
      router.replace("/profilecard"); // or whatever your profile route is
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setTips(parsed);
    } catch (err) {
      console.error("Error parsing stored tips:", err);
      router.replace("/profilecard");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleSave = (tip: Tip) => {
    const saved = JSON.parse(localStorage.getItem("savedTips") || "[]");
    if (!saved.some((t: Tip) => t.id === tip.id)) {
      saved.push(tip);
      localStorage.setItem("savedTips", JSON.stringify(saved));
    }
    router.push("/my-saves");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-950 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">✨ Your Personalized Board</h1>

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
                  onClick={() => router.push(`/aitips/${tip.id}`)}
                  className="w-full cursor-pointer"
                >
                  <Card className="w-full bg-gray-800/70 border border-gray-700 rounded-2xl shadow-lg hover:border-purple-500 transition">
                    <CardContent className="p-5 flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex items-start gap-4">
                        <span className="text-4xl mt-1">{tip.icon}</span>
                        <div>
                          <h2 className="text-lg font-semibold">{tip.title}</h2>
                          <p className="mt-2 text-sm text-gray-300">
                            {tip.explanation}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full md:w-auto mt-4 md:mt-0 gap-4">
                        <span className="text-xs text-purple-400">
                          {tip.category}
                        </span>
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
