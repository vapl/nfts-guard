// socialLinks.ts (bez JSX)
import { IconType } from "react-icons";
import { FaTwitter, FaInstagram, FaLinkedin, FaDiscord } from "react-icons/fa";

export interface SocialLink {
  name: "twitter" | "instagram" | "linkedin" | "discord";
  icon: IconType;
  href: string;
}

export const socialLinks: SocialLink[] = [
  { name: "twitter", icon: FaTwitter, href: "https://twitter.com" },
  { name: "instagram", icon: FaInstagram, href: "https://instagram.com" },
  { name: "linkedin", icon: FaLinkedin, href: "https://linkedin.com" },
  { name: "discord", icon: FaDiscord, href: "https://discord.com" },
];
