import * as LucidIcons from "lucide-react";
type LucidIconName = keyof typeof LucidIcons;

export type SupportedLanguage = "en" | "da";

export type TranslatedString = {
  [key in SupportedLanguage]: string;
};

export interface Team {
  name: TranslatedString;
  logo: LucidIconName;
  plan: TranslatedString;
}

export interface NavItem {
  title: TranslatedString;
  url: string;
  icon: LucidIconName;
  isActive?: boolean;
  items?: Array<{
    title: TranslatedString;
    url: string;
  }>;
}

export interface Project {
  name: TranslatedString;
  url: string;
  icon: LucidIconName;
  moreIcon: LucidIconName;
  actions: Array<{
    label: TranslatedString;
    icon: LucidIconName;
  }>;
}

export interface User {
  name: string;
  email: string;
  avatar: string;
}

export interface UserMenuItem {
  label: TranslatedString;
  icon: LucidIconName;
}

export interface SidebarData {
  language: SupportedLanguage;
  teams: Team[];
  navMain: NavItem[];
  projects: Project[];
  moreProjectsIcon: LucidIconName;
  user: User;
  userMenuItems: UserMenuItem[];
}