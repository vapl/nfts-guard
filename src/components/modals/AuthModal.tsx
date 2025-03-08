"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  authMode: "login" | "register";
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, authMode }) => {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [mode, setMode] = useState(authMode);

  // Escape (Esc) atbalsts modāļa aizvēršanai
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleForgotPassword = () => setIsForgotPassword(true);
  const handleBackToLogin = () => setIsForgotPassword(false);

  useEffect(() => {
    if (!isOpen) {
      setIsForgotPassword(false);
    }
    setMode(authMode);
  }, [authMode, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-gray-900/90 text-white rounded-2xl shadow-xl max-w-5xl w-full mx-4 p-8 relative animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Modal content */}

        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-8">
          {!isForgotPassword ? (
            <>
              {/* Login / Register tabs */}
              <div className="flex justify-between mb-6 border-b border-gray-700">
                <button
                  className={`pb-2 ${
                    mode === "login"
                      ? "border-b-2 border-purple-500 text-purple-400"
                      : "text-gray-400"
                  }`}
                  onClick={() => setMode("login")}
                >
                  Log In
                </button>
                <button
                  className={`pb-2 ${
                    mode === "register"
                      ? "border-b-2 border-purple-500 text-purple-400"
                      : "text-gray-400"
                  }`}
                  onClick={() => setMode("register")}
                >
                  Create account
                </button>
              </div>

              {/* Form */}
              <form className="space-y-4">
                {mode === "register" && (
                  <div>
                    <label className="block text-gray-300 mb-1 text-left">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full p-3 rounded-lg bg-black/20 text-white border border-white/20 focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-gray-300 mb-1 text-left">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="E.g., jane@company.com"
                    className="w-full p-3 rounded-lg bg-black/20 text-white border border-white/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 text-left">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full p-3 rounded-lg bg-black/20 text-white border border-white/20 focus:outline-none"
                  />
                </div>

                {/* Remember me */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 text-xs text-gray-300 text-left"
                  >
                    I have read and agree to NFTs Guard{" "}
                    <Link
                      href="/terms"
                      className="text-purple-400 hover:underline"
                    >
                      terms of service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-purple-400 hover:underline"
                    >
                      privacy policy
                    </Link>
                    .
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  {mode === "login" ? "Log In" : "Sign up"}
                </button>
              </form>

              {/* Forgot Password */}
              {mode === "login" && (
                <div className="text-center mt-4">
                  <button
                    onClick={handleForgotPassword}
                    className="text-sm text-purple-400 hover:underline"
                  >
                    I forgot my password
                  </button>
                </div>
              )}
            </>
          ) : (
            // Forgot Password form
            <div>
              <h2 className="text-2xl font-bold text-purple-400 mb-4">
                Forgot Password
              </h2>
              <p className="text-gray-300 mb-4">
                Enter your email and we&apos;ll send you a reset link.
              </p>

              <div>
                <label className="block text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="E.g., jane@company.com"
                  className="w-full p-3 rounded-lg bg-black/20 text-white border border-white/20 focus:outline-none mb-4"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Send Reset Link
              </button>

              <div className="text-center mt-4">
                <button
                  onClick={handleBackToLogin}
                  className="text-sm text-purple-400 hover:underline"
                >
                  Back to Log In
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right side - Image */}
        <div className="hidden md:block w-1/2 relative">
          <Image
            src="/login-bg-1.jpg"
            alt="Login Background"
            fill
            objectFit="cover"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
