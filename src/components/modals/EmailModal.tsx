"use client";

import { useState } from "react";
import { Input } from "../ui/Input";
import Button from "../ui/Button";
import { supabase } from "@/lib/supabase/supabase";
import { getValidationError } from "@/utils/validation";
import { MdEmail } from "react-icons/md";
import { getClientInfo } from "@/utils/getClientInfo";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (email: string) => void;
}

export default function EmailModal({ isOpen, onClose, onSubmit }: Props) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearMessageAfterDelay = () => {
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

  const maskEmail = (email: string): string => {
    const [name, domain] = email.split("@");
    return `${name[0]}***@${domain.slice(0, 2)}***.${domain.split(".").pop()}`;
  };

  const handleSubmit = async () => {
    const trimmed = email.trim().toLowerCase();

    const error = getValidationError("email", trimmed, undefined, true);
    if (error) {
      setMessage(error);
      setMessageType("error");
      clearMessageAfterDelay();
      return;
    }

    setIsSubmitting(true);

    try {
      const { ip, fingerprint, userAgent } = await getClientInfo();

      // 1. Get usage by IP
      const { data: usage } = await supabase
        .from("scan_usage")
        .select("email")
        .eq("ip_address", ip)
        .maybeSingle();

      const emailsMatch = usage?.email?.toLowerCase() === trimmed;

      // ❗ Ja IP piesaistīts citam e-pastam (nevis pašreizējam)
      if (usage?.email && !emailsMatch) {
        // Pārbauda vai tas cits e-pasts ir verificēts
        const { data: linkedSubscriber } = await supabase
          .from("subscribers")
          .select("is_verified")
          .eq("email", usage.email)
          .maybeSingle();

        if (linkedSubscriber?.is_verified) {
          setMessage("This IP is already linked to another verified email.");
          setMessageType("error");
          setIsSubmitting(false);
          clearMessageAfterDelay();
          return;
        }

        // ❗ Ja IP ir sasaistīts ar citu e-pastu, bet tas nav verificēts – ļaujam nomainīt
      }

      // 2. Check if email is already in `subscribers`
      const { data: existingSubscriber } = await supabase
        .from("subscribers")
        .select("email, is_verified")
        .eq("email", trimmed)
        .maybeSingle();

      if (existingSubscriber?.is_verified) {
        setMessage("This email is already verified.");
        setMessageType("success");
        setIsSubmitting(false);
        clearMessageAfterDelay();
        if (onSubmit) onSubmit(trimmed); // 🔁 Refresh UI
        return;
      }

      // 3. Insert or update scan_usage
      const { data: scanUsage } = await supabase
        .from("scan_usage")
        .select("ip_address")
        .eq("ip_address", ip)
        .maybeSingle();

      if (!scanUsage) {
        const { error: insertScanError } = await supabase
          .from("scan_usage")
          .insert({
            ip_address: ip,
            email: trimmed,
            fingerprint,
            user_agent: userAgent,
            scans_today: 0,
            total_scans: 0,
            last_scan_at: null,
          });

        if (insertScanError) {
          setMessage("Failed to register scan usage.");
          setMessageType("error");
          setIsSubmitting(false);
          return;
        }
      } else {
        // Update if not already linked
        const { error: updateError } = await supabase
          .from("scan_usage")
          .update({
            email: trimmed,
            fingerprint,
            user_agent: userAgent,
          })
          .eq("ip_address", ip);

        if (updateError) {
          setMessage("Failed to link your IP to email.");
          setMessageType("error");
          setIsSubmitting(false);
          return;
        }
      }

      // 4. Send verification email
      const response = await fetch("/api/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, ip }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result?.error || "Email send failed. Please try again.");
        setMessageType("error");
        console.error("Resend error:", result.error);
      } else {
        setMessage(
          `Verification email sent to ${maskEmail(
            trimmed
          )}. Please check your inbox.`
        );
        setMessageType("success");

        if (onSubmit) onSubmit(trimmed);

        setTimeout(() => {
          setMessage(""); // notīri pēc tam
          onClose(); // aizver modalīti
        }, 5000); // ← pietiek ar 2–3 sekundēm
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setMessage("Something went wrong. Please try again later.");
      setMessageType("error");
    }

    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-card p-6 rounded-xl w-full max-w-md shadow-lg text-center mx-4">
        <h2 className="text-xl font-bold mb-4">Enter your email</h2>
        <p className="text-sm text-paragraph mb-4">
          Get <strong>2 more scans</strong> today by verifying your email.
        </p>

        <Input
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          iconLeft={<MdEmail size={24} className="ml-2" />}
          validate="email"
          required
          // showError={!!message && messageType === "error"}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={isSubmitting}
        />

        {message && (
          <div
            className={`mt-3 px-4 py-2 rounded text-sm ${
              messageType === "success"
                ? "bg-green-500/10 text-green-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-4 flex justify-center gap-4">
          <Button
            label="Cancel"
            onClick={onClose}
            style="secondary"
            disabled={isSubmitting}
          />
          <Button
            label="Continue"
            loadingLabel="Sending"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
