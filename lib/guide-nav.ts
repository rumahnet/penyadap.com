import { NavItem, SidebarNavItem } from "@/types";

interface AndroidSidebarNavProps {
  children: React.ReactNode;
}

export function generateAndroidSidebarNav(): SidebarNavItem[] {
  const baseItems: NavItem[] = [
    {
      title: "Home",
      href: "/android",
    },
    {
      title: "Installation - Tahap 1",
      href: "/android/installation/tahap-1",
    },
    {
      title: "Installation - Tahap 2",
      href: "/android/installation/tahap-2",
    },
    {
      title: "Installation - Tahap 3",
      href: "/android/installation/tahap-3",
    },
    {
      title: "Installation - Tahap 4",
      href: "/android/installation/tahap-4",
    },
    {
      title: "Installation - Tahap 5",
      href: "/android/installation/tahap-5",
    },
  ];

  return [
    {
      title: "Android",
      items: baseItems,
    },
  ];
}

export function generateiOSSidebarNav(): SidebarNavItem[] {
  const baseItems: NavItem[] = [
    {
      title: "Home",
      href: "/ios",
    },
    {
      title: "Installation - Tahap 1",
      href: "/ios/installation/tahap-1",
    },
    {
      title: "Installation - Tahap 2",
      href: "/ios/installation/tahap-2",
    },
    {
      title: "Installation - Tahap 3",
      href: "/ios/installation/tahap-3",
    },
    {
      title: "Installation - Tahap 4",
      href: "/ios/installation/tahap-4",
    },
    {
      title: "Installation - Tahap 5",
      href: "/ios/installation/tahap-5",
    },
  ];

  return [
    {
      title: "iOS",
      items: baseItems,
    },
  ];
}
