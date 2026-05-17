export type NavLink = {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
};

export type SocialLink = {
  href: string;
  icon: React.ReactNode;
};

export interface ExpandedProps {
  setIsMenuOpen: (b: boolean) => void;
}
