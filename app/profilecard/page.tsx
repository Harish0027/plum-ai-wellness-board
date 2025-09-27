"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Mars,
  Venus,
  Heart,
  Dumbbell,
  Brain,
  Plus,
  Star,
  Sun,
  Moon,
  Zap,
} from "lucide-react";

export const iconMap: { [key: string]: any } = {
  Dumbbell: Dumbbell,
  Brain: Brain,
  Heart: Heart,
  Star: Star,
  Sun: Sun,
  Moon: Moon,
  Zap: Zap,
  Plus: Plus,
};

export default function ProfileCapture() {
  const bgDark = "#1F1F2E";
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [goal, setGoal] = useState("");
  const [customGoal, setCustomGoal] = useState("");
  const [goalOptions, setGoalOptions] = useState([
    { value: "weight-loss", icon: <Dumbbell size={28} />, color: "#8B5CF6" },
    { value: "focus", icon: <Brain size={28} />, color: "#A78BFA" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const steps = ["Age", "Gender", "Goal"];

  const nextStep = () => {
    if (step === 0 && !age) {
      setError("Age is required");
      return;
    }
    if (step === 1 && !gender) {
      setError("Gender is required");
      return;
    }
    if (step === 2 && !goal) {
      setError("Goal is required");
      return;
    }
    setStep(step + 1);
    setError("");
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
      setError("");
    }
  };

  const handleFinish = async () => {
    if (!age || !gender || !goal) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      // Save user info to localStorage
      const userInfo = { age, gender, goal };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      // Check if AI tips already exist for this user
      const storedTips = localStorage.getItem("aiTips");
      if (storedTips) {
        const parsedTips = JSON.parse(storedTips);
        // Verify the stored tips match current user info
        if (
          parsedTips.user?.age === age &&
          parsedTips.user?.gender === gender &&
          parsedTips.user?.goal === goal
        ) {
          // Tips already exist, no need to call Gemini
          router.push("/aitips");
          return;
        }
      }

      // Otherwise, call Gemini API to generate tips
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      });

      const data = await res.json();

      if (data.error) {
        setError("Failed to generate AI tips");
        return;
      }

      // Save AI tips with user info in localStorage
      localStorage.setItem(
        "aiTips",
        JSON.stringify({ user: userInfo, tips: data })
      );

      router.push("/aitips");
    } catch (err) {
      console.error(err);
      setError("Failed to generate AI tips");
    } finally {
      setLoading(false);
    }
  };

  // Add custom goal after AI validation
  const addCustomGoal = async () => {
    const trimmed = customGoal.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/validate-goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: trimmed }),
      });

      const data = await res.json();

      if (!data.valid) {
        setError("This is not a valid goal.");
        return;
      }

      if (
        !goalOptions.some(
          (g) => g.value.toLowerCase() === trimmed.toLowerCase()
        )
      ) {
        const newGoal = {
          value: trimmed,
          icon: iconMap[data.icon] || <Plus size={28} />,
          color: "#F472B6",
        };
        setGoalOptions([...goalOptions, newGoal]);
      }

      setGoal(trimmed);
      setCustomGoal("");
    } catch (err) {
      console.error(err);
      setError("Failed to validate goal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f0f1a] via-[#1f1f2e] to-[#2a2a3d] overflow-hidden p-4">
      <div className="mb-8 text-center z-20">
        <h1 className="text-4xl font-bold text-purple-400 mb-2">
          Complete Your Profile
        </h1>
        <p className="text-gray-300 text-lg">
          Fill in your age, gender, and goal to get personalized AI tips
        </p>
      </div>

      <Card className="relative z-10 w-full max-w-md rounded-3xl shadow-2xl bg-gray-900/50 backdrop-blur-lg border border-gray-800 overflow-hidden">
        <div className="px-6 pt-6">
          <Progress
            value={((step + 1) / steps.length) * 100}
            className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
          />
          <p className="text-center mt-2 font-semibold text-purple-300 text-lg">
            {steps[step]}
          </p>
        </div>

        <CardContent className="px-6 py-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="age"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center space-y-6"
              >
                <User size={60} className="text-purple-400" />
                <input
                  type="number"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    if (e.target.value) setError("");
                  }}
                  className={`w-full bg-gray-800 text-white border rounded-2xl p-4 text-center text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                    error && !age ? "border-red-500" : "border-gray-700"
                  }`}
                />
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="gender"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-3 gap-4"
              >
                {[
                  { value: "male", icon: <Mars size={28} />, color: "#8B5CF6" },
                  {
                    value: "female",
                    icon: <Venus size={28} />,
                    color: "#A78BFA",
                  },
                  {
                    value: "other",
                    icon: <Heart size={28} />,
                    color: "#F472B6",
                  },
                ].map((g) => (
                  <motion.button
                    key={g.value}
                    onClick={() => {
                      setGender(g.value);
                      setError("");
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-2 p-5 rounded-2xl border-2 font-semibold"
                    style={{
                      background: gender === g.value ? g.color : bgDark,
                      color: gender === g.value ? "#FFF" : g.color,
                      borderColor: g.color,
                    }}
                  >
                    {g.icon}
                    <span className="capitalize">{g.value}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="goal"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  {goalOptions.map((g) => (
                    <motion.button
                      key={g.value}
                      onClick={() => {
                        setGoal(g.value);
                        setError("");
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 p-4 rounded-2xl border-2 font-semibold"
                      style={{
                        background: goal === g.value ? g.color : bgDark,
                        color: goal === g.value ? "#FFF" : g.color,
                        borderColor: g.color,
                      }}
                    >
                      {/* {g.icon} */}
                      <span className="capitalize text-sm">{g.value}</span>
                    </motion.button>
                  ))}
                </div>

                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Add custom goal"
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCustomGoal()}
                    className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Button
                    onClick={addCustomGoal}
                    disabled={loading}
                    className="px-4 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl"
                  >
                    {loading ? "Validating..." : "Add"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <p className="text-red-500 text-sm mt-4 text-center font-medium">
              {error}
            </p>
          )}

          <div className="mt-8 flex justify-between">
            {step > 0 && (
              <Button
                onClick={prevStep}
                className="bg-gray-800/30 text-white hover:bg-purple-700/50 hover:text-white border border-gray-700 transition rounded-lg px-4 py-2"
              >
                Back
              </Button>
            )}

            {step < steps.length - 1 ? (
              <Button
                style={{
                  background: "linear-gradient(90deg,#8B5CF6,#A78BFA)",
                  color: "#FFF",
                }}
                onClick={nextStep}
              >
                Next
              </Button>
            ) : (
              <Button
                style={{
                  background: "linear-gradient(90deg,#8B5CF6,#A78BFA)",
                  color: "#FFF",
                }}
                onClick={handleFinish}
                disabled={loading}
              >
                {loading ? "Generating..." : "Finish"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
