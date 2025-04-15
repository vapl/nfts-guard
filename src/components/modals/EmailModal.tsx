"use client";

import { useEffect, useState } from "react";
import { Input } from "../ui/Input";
import Button from "../ui/Button";
import { supabase } from "@/lib/supabase/supabase";
import { getValidationError } from "@/utils/validation";
import { MdEmail } from "react-icons/md";
import { getClientInfo } from "@/utils/getClientInfo";
import { getSettings } from "@/utils/getSettings";

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
  const [freeScans, setFreeScans] = useState(0);

  const clearMessageAfterDelay = () => {
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

  useEffect(() => {
    const fetchDefaultFreeScans = async () => {
      const scans = await getSettings<number>("default_free_scans");
      setFreeScans(scans ?? 3);
    };
    fetchDefaultFreeScans();
  }, []);

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

      // 1. IP jau sasaistīts ar citu e-pastu?
      const { data: usage } = await supabase
        .from("scan_usage")
        .select("email")
        .eq("ip_address", ip)
        .maybeSingle();

      const emailLinkedToOther =
        usage?.email && usage.email.toLowerCase() !== trimmed;

      if (emailLinkedToOther) {
        const { data: other } = await supabase
          .from("subscribers")
          .select("is_verified")
          .eq("email", usage.email)
          .maybeSingle();

        if (other?.is_verified) {
          setMessage("This IP is already linked to another verified email.");
          setMessageType("error");
          setIsSubmitting(false);
          clearMessageAfterDelay();
          return;
        }
      }

      // 2. Šis e-pasts jau verificēts?
      const { data: subscriber } = await supabase
        .from("subscribers")
        .select("is_verified")
        .eq("email", trimmed)
        .maybeSingle();

      if (subscriber?.is_verified) {
        setMessage("This email is already verified.");
        setMessageType("success");
        setIsSubmitting(false);
        clearMessageAfterDelay();
        if (onSubmit) onSubmit(trimmed);
        return;
      }

      // 3. Update esošo rindu
      const { data: updated, error: updateErr } = await supabase
        .from("scan_usage")
        .update({
          email: trimmed,
          fingerprint,
          user_agent: userAgent,
          free_scans_left: freeScans - 1,
          free_scans_reset_at: new Date().toISOString().split("T")[0],
          free_scan_used: true,
        })
        .eq("ip_address", ip)
        .select("*");

      if (updateErr) {
        console.error("❌ Update error:", updateErr.message);
      }

      // 4. Ja update nenostrādāja — veido jaunu rindu
      if (!updated || updated.length === 0) {
        const { error: insertErr } = await supabase.from("scan_usage").insert({
          ip_address: ip,
          email: trimmed,
          fingerprint,
          user_agent: userAgent,
          paid_scans_left: 0,
          free_scans_left: freeScans - 1,
          free_scan_used: true,
          free_scans_reset_at: new Date().toISOString().split("T")[0],
          total_scans: 0,
          last_scan_at: null,
        });

        if (insertErr) {
          setMessage("Failed to link your IP to email.");
          setMessageType("error");
          setIsSubmitting(false);
          return;
        }
      }

      // 5. Sūti verifikācijas e-pastu
      const response = await fetch("/api/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, ip }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("📧 Email error:", result?.error);
        setMessage(result?.error || "Email send failed. Please try again.");
        setMessageType("error");
      } else {
        setMessage(
          `Verification email sent to ${maskEmail(
            trimmed
          )}. Please check your inbox.`
        );
        setMessageType("success");
        if (onSubmit) onSubmit(trimmed);

        setTimeout(() => {
          setMessage("");
          onClose();
        }, 5000);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setMessage("Something went wrong. Please try again later.");
      setMessageType("error");
    }

    setIsSubmitting(false);
  };

  const validFreeScans = Math.max(freeScans - 1, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-card p-6 rounded-xl w-full max-w-md shadow-lg text-center mx-4">
        <h2 className="text-xl font-bold mb-4">Enter your email</h2>
        <p className="text-sm text-paragraph mb-4">
          Get <strong>{validFreeScans} more scans</strong> today by verifying
          your email.
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
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={isSubmitting}
        />
        <p className="text-xs text-paragraph mt-2">
          By submitting you agree with our{" "}
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-accent-purple"
          >
            Legal Terms
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-accent-purple"
          >
            Privacy Policy
          </a>
          .
        </p>

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
