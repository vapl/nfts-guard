import { socialLinks } from "@/constants/socialLinks";

interface SocialIconsProps {
  icons?: string[];
}

const SocialIcons = ({ icons }: SocialIconsProps) => {
  const filteredLinks = icons
    ? socialLinks.filter((link) =>
        icons.includes(link.name.toLocaleLowerCase())
      )
    : socialLinks;
  return (
    <div className="flex gap-4">
      {filteredLinks.map(({ icon: Icon, href }, index) => (
        <a key={index} href={href} target="_blank" rel="noopener noreferrer">
          <Icon size={24} className="text-white hover:text-purple-600" />
        </a>
      ))}
    </div>
  );
};

export default SocialIcons;
