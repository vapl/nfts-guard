"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UnsubscribePage() {
  const params = useSearchParams();
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const success = params?.get("success");
    const error = params?.get("error");

    if (success) {
      setMessage("You have been successfully unsubscribed.");
    } else if (error === "missing_email") {
      setMessage("Email address is missing.");
    } else {
      setMessage("Unsubscribe failed. Please try again.");
    }
  }, [params]);

  return (
    <div className="flex flex-col w-full px-4 lg:px-16 xl:px-24 items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Unsubscribe</h1>
      <p className="text-paragraph text-gray-300">{message}</p>
    </div>
  );
}
