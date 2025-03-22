// socialLinks.ts (bez JSX)
import { IconType } from "react-icons";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter, FaDiscord } from "react-icons/fa6";

export interface SocialLink {
  name: "twitter" | "instagram" | "linkedin" | "discord";
  icon: IconType;
  href: string;
}

export const socialLinks: SocialLink[] = [
  { name: "twitter", icon: FaXTwitter, href: "https://twitter.com/NFTsGuard" },
  { name: "instagram", icon: FaInstagram, href: "https://instagram.com" },
  { name: "linkedin", icon: FaLinkedin, href: "https://linkedin.com" },
  { name: "discord", icon: FaDiscord, href: "https://discord.gg/zqhEbgEsur" },
];
