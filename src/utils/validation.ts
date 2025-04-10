// Ethereum / Solana / Polygon
export function validateAddress(address: string, chain: string): boolean {
  const trimmed = address.trim();
  switch (chain.toLowerCase()) {
    case "ethereum":
    case "polygon":
      return /^0x[a-fA-F0-9]{40}$/.test(trimmed);
    case "solana":
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(trimmed);
    default:
      return false;
  }
}

// Email
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// Password (min 8 chars, at least 1 number + letter)
export function validatePassword(password: string): boolean {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);
}

// (Optional) Centralized validation handler
export function validateInput(
  type: "email" | "password" | "address",
  value: string,
  chain?: string
): boolean {
  switch (type) {
    case "email":
      return validateEmail(value);
    case "password":
      return validatePassword(value);
    case "address":
      return validateAddress(value, chain || "ethereum");
    default:
      return false;
  }
}

export function getValidationError(
  type: "email" | "password" | "address",
  value: string,
  chain?: string,
  required: boolean = true
): string | null {
  const trimmed = value.trim();

  if (required && !trimmed) {
    switch (type) {
      case "email":
        return "Email is required.";
      case "password":
        return "Password is required.";
      case "address":
        return "Contract address is required.";
      default:
        return "This field is required.";
    }
  }

  switch (type) {
    case "email":
      if (!validateEmail(trimmed)) return "Please enter a valid email address.";
      return null;

    case "password":
      if (trimmed.length < 8) return "Password must be at least 8 characters.";
      if (!/\d/.test(trimmed))
        return "Password must include at least one number.";
      if (!/[A-Za-z]/.test(trimmed))
        return "Password must include at least one letter.";
      return null;

    case "address":
      if (!validateAddress(trimmed, chain || "ethereum")) {
        return `Invalid address for selected chain (${chain || "ethereum"}).`;
      }
      return null;

    default:
      return null;
  }
}
