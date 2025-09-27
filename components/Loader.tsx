"use client";
import React from "react";

export default function SpinningLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="flex flex-col items-center gap-4">
        {/* Spinning Circle */}
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>

        {/* Optional Text */}
        <p className="text-white text-lg font-semibold">
          Generating your personalized tips...
        </p>
      </div>
    </div>
  );
}
