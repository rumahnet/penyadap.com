import { DocsConfig } from "types";

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Android",
      href: "/android",
    },
    {
      title: "iOS",
      href: "/ios",
    },
  ],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/android",
        },
        {
          title: "Installation",
          href: "/android/installation",
        },
      ],
    },
    {
      title: "Configuration",
      items: [
        {
          title: "Authentification",
          href: "/android/configuration/authentification",
        },
        {
          title: "Blog",
          href: "/android/configuration/blog",
        },
        {
          title: "Components",
          href: "/android/configuration/components",
        },
        {
          title: "Config files",
          href: "/android/configuration/config-files",
        },
        {
          title: "Database",
          href: "/android/configuration/database",
        },
        {
          title: "Email",
          href: "/android/configuration/email",
        },
        {
          title: "Layouts",
          href: "/android/configuration/layouts",
        },
        {
          title: "Markdown files",
          href: "/android/configuration/markdown-files",
        },

      ],
    },
  ],
};
