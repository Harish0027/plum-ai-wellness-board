"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TipDetail {
  id: number;
  title: string;
  icon: string;
  explanation: string;
  fullAdvice: string[];
}

interface SavedTipCardProps {
  tip: TipDetail;
  stepIndex: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function SavedTipCard({
  tip,
  stepIndex,
  onPrev,
  onNext,
}: SavedTipCardProps) {
  if (!tip || !tip.fullAdvice) return null;
  const totalSteps = tip.fullAdvice.length;

  return (
    <Card className="shadow-xl bg-gray-900/80 border border-gray-800 backdrop-blur-md relative">
      <CardContent className="flex flex-col items-center text-center p-6 space-y-3">
        <div className="text-5xl text-purple-400">{tip.icon}</div>
        <h2 className="font-bold text-xl text-white">{tip.title}</h2>
        <p className="text-gray-300 text-sm">{tip.explanation}</p>
      </CardContent>

      {/* Step Carousel */}
      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex"
          animate={{ x: -stepIndex * 100 + "%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {tip.fullAdvice.map((step, i) => (
            <CardContent
              key={i}
              className="flex-shrink-0 w-full p-6 flex flex-col items-center text-center space-y-2"
              style={{ minHeight: 180 }}
            >
              <h3 className="font-bold text-lg text-white">Step {i + 1}</h3>
              <p className="text-gray-300 text-sm break-words">{step}</p>
            </CardContent>
          ))}
        </motion.div>

        <button
          onClick={onPrev}
          disabled={stepIndex === 0}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full disabled:opacity-40 transition backdrop-blur-md bg-white/10 hover:bg-white/20 text-white"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={onNext}
          disabled={stepIndex === totalSteps - 1}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full disabled:opacity-40 transition backdrop-blur-md bg-white/10 hover:bg-white/20 text-white"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Step Indicators */}
      <div className="flex space-x-2 justify-center mt-3 mb-4">
        {tip.fullAdvice.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition ${
              i === stepIndex ? "bg-purple-400" : "bg-gray-700"
            }`}
          />
        ))}
      </div>
    </Card>
  );
}
