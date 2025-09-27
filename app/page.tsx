"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HeartPulse, Bookmark, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    // set only on client
    setScreenWidth(window.innerWidth);

    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-950 text-white overflow-hidden">
      {/* Floating particles */}
      {screenWidth > 0 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-30"
              initial={{ y: "100vh", x: Math.random() * screenWidth }}
              animate={{ y: -20 }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      {/* Hero */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-16 tracking-tight flex items-center gap-3"
      >
        <Sparkles className="w-10 h-10 text-purple-400 animate-pulse" />
        AI-Generated Wellness Board
      </motion.h1>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="flex flex-col md:flex-row gap-8"
      >
        <Button
          onClick={() => router.push("/profilecard")}
          variant="default"
          className="px-10 py-6 text-xl font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
        >
          <HeartPulse className="w-6 h-6" />
          Generate Tip
        </Button>

        <Button
          onClick={() => router.push("/my-saves")}
          variant="outline"
          className="px-10 py-6 text-xl font-semibold border-purple-500 text-purple-400 hover:bg-purple-700 hover:text-white shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
        >
          <Bookmark className="w-6 h-6" />
          Saved Tips
        </Button>
      </motion.div>
    </div>
  );
}
