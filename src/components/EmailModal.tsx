import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import type { OptimizerOutput } from "../data/types";

const SERVICE_ID  = import.meta.env.VITE_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID;
const PUBLIC_KEY  = import.meta.env.VITE_PUBLIC_KEY;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  result: OptimizerOutput;
  animalLabel: string;
  stageLabel: string;
  totalFeedKg: number;
}

type Status = "idle" | "sending" | "sent" | "error";

export default function EmailModal({
  isOpen,
  onClose,
  result,
  animalLabel,
  stageLabel,
  totalFeedKg,
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const buildTemplateParams = () => {
    const nutrients = result.nutrients
        .map(
        (n) => `
        <tr>
            <td style="padding:10px 16px;">${n.name}</td>
            <td style="padding:10px 16px;">${n.achieved} ${n.unit}</td>
            <td style="padding:10px 16px;">${n.required} ${n.unit}</td>
            <td style="padding:10px 16px;">
            ${n.met ? "✔ Met" : "✘ Not met"}
            </td>
        </tr>`
        )
        .join("");

    const composition = result.composition
        .map(
        (c) => `
        <tr>
            <td style="padding:10px 16px;">${c.label}</td>
            <td style="padding:10px 16px;">${c.amountKg} kg</td>
            <td style="padding:10px 16px;">₱${c.costContribution.toFixed(2)}</td>
        </tr>`
        )
        .join("");

    return {
        to_email: email,
        animal: animalLabel,
        stage: stageLabel,
        total_feed_kg: totalFeedKg,
        total_cost: result.totalCost.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        }),
        nutrients,
        composition,
    };
    };

  const handleSend = async () => {
    if (!isValidEmail) return;
    setStatus("sending");
    setErrorMsg("");

    try {
      await emailjs.send(SERVICE_ID ? SERVICE_ID: "", TEMPLATE_ID ? TEMPLATE_ID : "", buildTemplateParams(), PUBLIC_KEY);
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMsg("Failed to send. Please try again.");
    }
  };

  const handleClose = () => {
    // Reset state on close so it's fresh next time
    setEmail("");
    setStatus("idle");
    setErrorMsg("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">

              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Email results
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    We'll send a summary of the formulation to your inbox.
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="text-slate-400 hover:text-slate-600 text-xl leading-none focus:outline-none"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Result summary preview */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-3 space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Summary
                </p>
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">{animalLabel}</span> — {stageLabel}
                </p>
                <p className="text-sm text-slate-700">
                  Total feed: <span className="font-mono font-semibold">{totalFeedKg} kg</span>
                </p>
                <p className="text-sm text-slate-700">
                  Total cost:{" "}
                  <span className="font-mono font-semibold text-emerald-800">
                    ₱{result.totalCost.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </span>
                </p>
                <p className="text-xs text-slate-400 pt-1">
                  + {result.composition.length} ingredients · {result.nutrients.length} nutrient checks
                </p>
              </div>

              {/* Email input */}
              {status !== "sent" ? (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="you@example.com"
                    disabled={status === "sending"}
                    className={[
                      "w-full px-4 py-2.5 rounded-xl border-2 text-sm",
                      "focus:outline-none focus:ring-2 transition-colors duration-150",
                      status === "error"
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : "border-slate-200 focus:border-emerald-700 focus:ring-emerald-100",
                      status === "sending" ? "opacity-60 cursor-not-allowed" : "",
                    ].join(" ")}
                  />
                  {errorMsg && (
                    <p className="text-xs text-red-500">{errorMsg}</p>
                  )}
                </div>
              ) : (
                /* Success state */
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl px-4 py-4 text-center space-y-1">
                  <p className="text-2xl">✅</p>
                  <p className="text-sm font-bold text-emerald-800">Results sent!</p>
                  <p className="text-xs text-emerald-600">
                    Check your inbox at <span className="font-mono">{email}</span>
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleClose}
                  className={[
                    "flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-sm font-semibold text-slate-600",
                    "hover:bg-slate-50 transition-colors duration-150 focus:outline-none",
                  ].join(" ")}
                >
                  {status === "sent" ? "Close" : "Cancel"}
                </button>

                {status !== "sent" && (
                  <button
                    onClick={handleSend}
                    disabled={!isValidEmail || status === "sending"}
                    className={[
                      "flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-150 focus:outline-none",
                      !isValidEmail || status === "sending"
                        ? "bg-emerald-600/50 cursor-not-allowed"
                        : "bg-emerald-800 hover:bg-emerald-700",
                    ].join(" ")}
                  >
                    {status === "sending" ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⚙️</span>
                        Sending…
                      </span>
                    ) : (
                      "Send results"
                    )}
                  </button>
                )}
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}