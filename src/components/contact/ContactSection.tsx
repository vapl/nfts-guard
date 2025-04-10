"use client";

import React, { useState } from "react";
import { Input, TextArea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const clearMessageAfterDealay = () => {
    setTimeout(() => {
      setMessage("");
    }, 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setShowError(true);

    if (!form.name || !form.email || !form.message) {
      setShowError(true);
      return;
    }

    // Nosūtīšanas loģika šeit (piemēram, fetch uz serveri)
    setShowError(false);

    try {
      setIsLoading(true);
      const response = await fetch("/api/contact-email", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(
          "Thank you for reaching out — we’ll respond as soon as possible."
        );
        setError(false);
        setForm({ name: "", email: "", message: "" });
      } else {
        setMessage(
          "We couldn't send your message. Please check your connection and try again."
        );
        setError(true);
        console.error("Message send error: ", result.error);
      }
    } catch (error) {
      setMessage("An error occurred while sending the message.");
      setError(true);
      console.error("Error: ", error);
    }
    setIsLoading(false);
    setForm({ name: "", email: "", message: "" });
    setShowError(false);
    clearMessageAfterDealay();
  };

  return (
    <section className="flex flex-col w-full items-center pt-36 px-4 md:px-6">
      <div className="text-center mb-12">
        <span className="bg-purple-700 bg-opacity-20 text-white text-sm px-4 py-1 rounded-full uppercase tracking-wider">
          Contact Us
        </span>
        <h2 className="text-5xl md:text-7xl text-heading font-extrabold mt-4">
          Let&apos;s <span className="text-accent-purple">Talk</span>
        </h2>
        <p className="text-paragraph mt-4">
          Have feedback, suggestions or issues? We’re here to help!
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            required={true}
            showError={showError}
            className="drop-shadow-lg"
          />
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your email"
            className="drop-shadow-lg"
            validate="email"
            required={true}
            showError={showError}
          />
        </div>

        <TextArea
          name="message"
          rows={6}
          placeholder="Your message"
          value={form.message}
          required={true}
          onChange={handleChange}
          showError={showError}
          minLength={10}
          maxLength={600}
          className="drop-shadow-lg"
        />
        {message && (
          <div
            className={`mt-3 px-4 py-2 rounded text-sm ${
              !error
                ? "bg-green-500/10 text-green-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {message}
          </div>
        )}

        <Button
          label="Send message"
          isLoading={isLoading}
          loadingLabel="Sending"
          disabled={isLoading}
          onClick={handleSubmit}
          className="mx-auto"
        />
      </div>
    </section>
  );
}
