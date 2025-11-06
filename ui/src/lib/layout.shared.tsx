import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { Sparkle } from "lucide-react";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "@fydemy/ui",
    },
    githubUrl: "https://github.com/fydemy/ui",
    links: [
      {
        icon: <Sparkle />,
        text: "Community",
        url: "https://fydemy.com",
      },
    ],
  };
}
