"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dumbbell,
  Brain,
  Heart,
  Star,
  Sun,
  Moon,
  Zap,
  Plus,
} from "lucide-react";

interface TipDetail {
  id: number;
  title: string;
  icon: string;
  explanation: string;
  fullAdvice: string[];
}

const iconMap: Record<string, any> = {
  Dumbbell,
  Brain,
  Heart,
  Star,
  Sun,
  Moon,
  Zap,
  Plus,
};

export default function TipDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [tipDetail, setTipDetail] = useState<TipDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTipDetail = async () => {
      setLoading(true);
      try {
        const aiTipsData = JSON.parse(localStorage.getItem("aiTips") || "{}");
        const user = aiTipsData.user;
        const tip = aiTipsData.tips.find(
          (t: any) => String(t.id) === String(id)
        );
        if (!tip) throw new Error("Tip not found");

        const res = await fetch(`/api/aitips/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user, tip }),
        });

        const data = await res.json();
        const normalizedData: TipDetail = {
          ...data,
          fullAdvice: Array.isArray(data.fullAdvice)
            ? data.fullAdvice.map((step: string) =>
                step.replace(/\*\*/g, "").trim()
              )
            : [],
        };

        setTipDetail(normalizedData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTipDetail();
  }, [id]);

  const handleSave = () => {
    if (!tipDetail) return;

    const savedTips = JSON.parse(localStorage.getItem("savedTips") || "[]");

    const exists = savedTips.some(
      (t: any) =>
        t.title === tipDetail.title && t.explanation === tipDetail.explanation
    );

    if (!exists) {
      savedTips.push(tipDetail);
      localStorage.setItem("savedTips", JSON.stringify(savedTips));
    }

    router.push("/"); // optional redirect
  };

  const IconComponent = tipDetail ? iconMap[tipDetail.icon] || Plus : Plus;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f1a] via-[#1f1f2e] to-[#2a2a3d] p-6">
        <div className="w-full max-w-3xl space-y-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-4 bg-gray-800/70 rounded-xl animate-pulse"
            >
              <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-full"></div>
                <div className="h-3 bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  if (!tipDetail)
    return (
      <div className="text-red-500 p-6 text-center text-lg font-medium">
        Tip not found
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#0f0f1a] via-[#1f1f2e] to-[#2a2a3d] flex flex-col items-center font-sans">
      <Card className="max-w-3xl w-full shadow-xl bg-gray-900/80 border border-gray-800 backdrop-blur-md">
        <CardContent className="flex flex-col items-center text-center p-6 space-y-6">
          {/* Header Buttons */}
          <div className="w-full flex justify-between mb-4">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition text-sm md:text-base"
            >
              ← Back
            </button>
            <motion.button
              onClick={handleSave}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition text-sm md:text-base"
            >
              Save Tip
            </motion.button>
          </div>

          {/* Icon & Title */}
          <IconComponent size={64} className="text-purple-400 mb-3" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 leading-snug">
            {tipDetail.title}
          </h1>
          <p className="text-gray-300 text-sm md:text-base mb-6 leading-relaxed">
            {tipDetail.explanation}
          </p>

          {/* Full Advice */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            className="w-full space-y-3"
          >
            {(tipDetail.fullAdvice || []).map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-gray-300 text-sm md:text-base bg-gray-800/70 p-4 rounded-xl shadow hover:scale-105 hover:bg-purple-700/40 transition-transform cursor-pointer leading-relaxed"
              >
                {step}
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
