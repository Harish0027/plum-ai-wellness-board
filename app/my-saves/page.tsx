"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SavedTipCard from "@/components/SavedTipCard";
import Pagination from "@/components/Paggination";

interface TipDetail {
  id: number;
  title: string;
  icon: string;
  explanation: string;
  fullAdvice: string[];
}

export default function MySavedTips() {
  const [savedTips, setSavedTips] = useState<TipDetail[]>([]);
  const [currentStep, setCurrentStep] = useState<{ [key: string]: number }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const TIPS_PER_PAGE = 3;

  useEffect(() => {
    const stored = localStorage.getItem("savedTips");
    if (stored) setSavedTips(JSON.parse(stored));
  }, []);

  const prevStep = (tipKey: string) => {
    setCurrentStep((prev) => ({
      ...prev,
      [tipKey]: Math.max((prev[tipKey] || 0) - 1, 0),
    }));
  };

  const nextStep = (tipKey: string, total: number) => {
    setCurrentStep((prev) => ({
      ...prev,
      [tipKey]: Math.min((prev[tipKey] || 0) + 1, total - 1),
    }));
  };

  if (!savedTips || savedTips.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f0f1a] via-[#1f1f2e] to-[#2a2a3d] p-6">
        <p className="text-gray-400 text-lg">No saved tips yet.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition"
        >
          Go to Home
        </button>
      </div>
    );
  }

  // Pagination calculations
  const totalPages = Math.ceil(savedTips.length / TIPS_PER_PAGE);
  const startIndex = (currentPage - 1) * TIPS_PER_PAGE;
  const endIndex = startIndex + TIPS_PER_PAGE;
  const paginatedTips = savedTips.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0f0f1a] via-[#1f1f2e] to-[#2a2a3d] p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-purple-400 text-center mt-5 mb-6 flex-none">
        My Saved Tips
      </h1>

      {/* Cards Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedTips.map((tip, tipIndex) => {
            const tipKey = `${tip.id}-${startIndex + tipIndex}`; // unique key for React
            const stepIndex = currentStep[tipKey] || 0;
            return (
              <SavedTipCard
                key={tipKey}
                tip={tip}
                stepIndex={stepIndex}
                onPrev={() => prevStep(tipKey)}
                onNext={() => nextStep(tipKey, tip.fullAdvice.length)}
              />
            );
          })}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex-none mt-4">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Back Button */}
      <div className="flex-none mt-4 flex justify-center">
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
